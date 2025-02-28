from fastapi import FastAPI, Query, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import List, Optional
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import requests
from exceptions import CarNotFoundException, CarUpdateException

load_dotenv()

app = FastAPI()

# les paramètres CORS pour autoriser les requêtes depuis n'importe quelle origine
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Autorisez votre frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connexion à MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["project_cars"]
cars_collection = db["cars"]
API_NINJAS_KEY = os.getenv("API_NINJAS_KEY")
API_NINJAS_URL = os.getenv("API_NINJAS_URL")

# CarUpdate pour la mise à jour des voitures
class CarUpdate(BaseModel):
    make: Optional[str]
    model: Optional[str]
    year: Optional[int]
    price: Optional[float]
    power: Optional[float]
    type: Optional[str]
    city_mpg: Optional[int]
    highway_mpg: Optional[int]
    combination_mpg: Optional[int]
    cylinders: Optional[int]
    displacement: Optional[float]
    transmission: Optional[str]
    fuel_type: Optional[str]
    
# Modèle Pydantic pour la validation des données
class Car(BaseModel):
    make: str
    model: str
    year: int
    price: float
    image: Optional[str] = None
    city_mpg: int
    car_class: str
    combination_mpg: int
    cylinders: int
    displacement: float
    drive: str
    fuel_type: str
    highway_mpg: int
    transmission: str
    power: Optional[float] = None  # Ajouter le champ power

# Convertisseur BSON -> JSON
def car_serializer(car) -> dict:
    return {
        "id": str(car["_id"]),
        "make": car["make"],
        "model": car["model"],
        "year": car["year"],
        "price": car.get("price", 0.0),  # Utiliser get pour fournir une valeur par défaut
        "image": car.get("image", ""),
        "city_mpg": car.get("city_mpg", 0),  # Utiliser get pour fournir une valeur par défaut
        "car_class": car.get("class", ""),  
        "combination_mpg": car.get("combination_mpg", 0),  # Utiliser get pour fournir une valeur par défaut
        "cylinders": car.get("cylinders", 0),  # Utiliser get pour fournir une valeur par défaut
        "displacement": car.get("displacement", 0.0),  # Utiliser get pour fournir une valeur par défaut
        "drive": car.get("drive", ""),
        "fuel_type": car.get("fuel_type", ""),
        "highway_mpg": car.get("highway_mpg", 0),  # Utiliser get pour fournir une valeur par défaut
        "transmission": car.get("transmission", "")
    }

# Gestionnaire d'exceptions pour CarNotFoundException
@app.exception_handler(CarNotFoundException)
async def car_not_found_exception_handler(request: Request, exc: CarNotFoundException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

# Gestionnaire d'exceptions pour CarUpdateException
@app.exception_handler(CarUpdateException)
async def car_update_exception_handler(request: Request, exc: CarUpdateException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

# 📌 3. Routes API 🚗
# ➤ Ajouter une voiture via un formulaire

@app.post("/import-car", response_model=dict)
async def import_car(
    make: str = Form(...),
    model: str = Form(...),
    year: int = Form(...)
):
    headers = {
        "X-Api-Key": API_NINJAS_KEY
    }
    params = {
        "make": make,
        "model": model,
        "year": year
    }
    response = requests.get(API_NINJAS_URL, headers=headers, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Erreur lors de la récupération des données de l'API")
    
    cars_data = response.json()
    for car_data in cars_data:
        car = Car(
            make=car_data["make"],
            model=car_data["model"],
            year=car_data["year"],
            price=car_data.get("price", 0.0),
            image=car_data.get("image", ""),
            city_mpg=car_data["city_mpg"],
            car_class=car_data["class"],
            combination_mpg=car_data["combination_mpg"],
            cylinders=car_data["cylinders"],
            displacement=car_data["displacement"],
            drive=car_data["drive"],
            fuel_type=car_data["fuel_type"],
            highway_mpg=car_data["highway_mpg"],
            transmission=car_data["transmission"]
        )
        await cars_collection.insert_one(car.dict())

    return {"message": "Données importées avec succès"}

# ➤ Récupérer toutes les voitures avec filtres
@app.get("/cars/", response_model=List[dict])
async def get_cars(make: Optional[str] = None, model: Optional[str] = None, year: Optional[int] = None):
    query = {}
    if make:
        query["make"] = {"$regex": make, "$options": "i"}
    if model:
        query["model"] = {"$regex": model, "$options": "i"}
    if year:
        query["year"] = year

    cursor = cars_collection.find(query)
    cars = await cursor.to_list(length=None)
    return [car_serializer(car) for car in cars]

# ➤ Récupérer une voiture par ID
@app.get("/cars/{car_id}", response_model=dict)
async def get_car(car_id: str):
    car = await cars_collection.find_one({"_id": ObjectId(car_id)})
    if not car:
        raise CarNotFoundException(car_id)
    return car_serializer(car)

# ➤ Supprimer une voiture
@app.delete("/cars/{car_id}")
async def delete_car(car_id: str):
    try:
        result = await cars_collection.delete_one({"_id": ObjectId(car_id)})
        if result.deleted_count == 0:
            raise CarNotFoundException(car_id)
        return {"message": "Voiture supprimée"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    


@app.put("/car/{make}/{model}/{year}", response_model=dict)
async def update_car(make: str, model: str, year: int, car_update: CarUpdate):
    update_data = {k: v for k, v in car_update.dict().items() if v is not None}
    result = await cars_collection.update_one(
        {"make": make, "model": model, "year": year},
        {"$set": update_data}
    )
    if result.modified_count == 1:
        updated_car = await cars_collection.find_one({"make": make, "model": model, "year": year})
        updated_car["_id"] = str(updated_car["_id"])
        return updated_car
    raise CarUpdateException(make, model, year)

# ➤ Calculer le nombre total de véhicules
@app.get("/total-vehicles", response_model=dict)
async def get_total_vehicles():
    total_vehicles = await cars_collection.count_documents({})
    return {"total": total_vehicles}

# ➤ Moyenne des puissances par marque/modèle
@app.get("/average-power-by-make-model", response_model=List[dict])
async def get_average_power_by_make_model():
    pipeline = [
        {
            "$group": {
                "_id": {"make": "$make", "model": "$model"},
                "average_power": {"$avg": "$power"}
            }
        }
    ]
    cursor = cars_collection.aggregate(pipeline)
    result = await cursor.to_list(length=None)
    return result

# ➤ Répartition des véhicules par année
@app.get("/vehicles-by-year", response_model=List[dict])
async def get_vehicles_by_year():
    pipeline = [
        {
            "$group": {
                "_id": "$year",
                "count": {"$sum": 1}
            }
        }
    ]
    result = await cars_collection.aggregate(pipeline).to_list(length=None)
    return result

# ➤ Répartition des véhicules par marque
@app.get("/vehicles-by-make", response_model=List[dict])
async def get_vehicles_by_make():
    pipeline = [
        {
            "$group": {
                "_id": "$make",
                "count": {"$sum": 1}
            }
        }
    ]
    result = await cars_collection.aggregate(pipeline).to_list(length=None)
    return result

# ➤ Répartition des types de véhicules
@app.get("/vehicles-by-type", response_model=List[dict])
async def get_vehicles_by_type():
    pipeline = [
        {
            "$group": {
                "_id": "$type",
                "count": {"$sum": 1}
            }
        }
    ]
    result = await cars_collection.aggregate(pipeline).to_list(length=None)
    return result

# ➤ Répartition des véhicules par type de carburant
@app.get("/vehicles-by-fuel-type", response_model=List[dict])
async def get_vehicles_by_fuel_type():
    pipeline = [
        {
            "$group": {
                "_id": "$fuel_type",
                "count": {"$sum": 1}
            }
        }
    ]
    result = await cars_collection.aggregate(pipeline).to_list(length=None)
    return result

# ➤ Répartition des véhicules par classe
@app.get("/vehicles-by-class", response_model=List[dict])
async def get_vehicles_by_class():
    pipeline = [
        {
            "$group": {
                "_id": "$car_class",
                "count": {"$sum": 1}
            }
        }
    ]
    result = await cars_collection.aggregate(pipeline).to_list(length=None)
    return result

# ➤ Répartition des véhicules par transmission
@app.get("/vehicles-by-transmission", response_model=List[dict])
async def get_vehicles_by_transmission():
    pipeline = [
        {
            "$group": {
                "_id": "$transmission",
                "count": {"$sum": 1}
            }
        }
    ]
    result = await cars_collection.aggregate(pipeline).to_list(length=None)
    return result

# ➤ Moyenne de l'économie de carburant par type de carburant
@app.get("/average-fuel-economy-by-fuel-type", response_model=List[dict])
async def get_average_fuel_economy_by_fuel_type():
    pipeline = [
        {
            "$group": {
                "_id": "$fuel_type",
                "average_city_mpg": {"$avg": "$city_mpg"},
                "average_highway_mpg": {"$avg": "$highway_mpg"},
                "average_combination_mpg": {"$avg": "$combination_mpg"}
            }
        }
    ]
    result = await cars_collection.aggregate(pipeline).to_list(length=None)
    return result

# ➤ Moyenne du nombre de cylindres par marque
@app.get("/average-cylinders-by-make", response_model=List[dict])
async def get_average_cylinders_by_make():
    pipeline = [
        {
            "$group": {
                "_id": "$make",
                "average_cylinders": {"$avg": "$cylinders"}
            }
        }
    ]
    result = await cars_collection.aggregate(pipeline).to_list(length=None)
    return result

# ➤ Répartition des véhicules par type de transmission (traction avant, arrière ou intégrale)
@app.get("/vehicles-by-drive", response_model=List[dict])
async def get_vehicles_by_drive():
    pipeline = [
        {
            "$group": {
                "_id": "$drive",
                "count": {"$sum": 1}
            }
        }
    ]
    result = await cars_collection.aggregate(pipeline).to_list(length=None)
    return result

# ➤ Répartition des véhicules selon le kilométrage urbain (city_mpg)
@app.get("/vehicles-by-city-mpg", response_model=List[dict])
async def get_vehicles_by_city_mpg():
    pipeline = [
        {
            "$group": {
                "_id": "$city_mpg",
                "count": {"$sum": 1}
            }
        }
    ]
    result = await cars_collection.aggregate(pipeline).to_list(length=None)
    return result

# ➤ Répartition des véhicules par année de modèle (tranches d'années)
@app.get("/vehicles-by-year-range", response_model=List[dict])
async def get_vehicles_by_year_range():
    pipeline = [
        {
            "$bucket": {
                "groupBy": "$year",
                "boundaries": [2000, 2005, 2010, 2015, 2020],
                "default": "Other",
                "output": {
                    "count": {"$sum": 1}
                }
            }
        }
    ]
    result = await cars_collection.aggregate(pipeline).to_list(length=None)
    return result


# ➤ Lancer le serveur
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)