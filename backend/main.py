from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import List, Optional
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import requests

load_dotenv()

app = FastAPI()

# les paramètres CORS pour autoriser les requêtes depuis n'importe quelle origine
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorisez toutes les origines, vous pouvez restreindre cela à votre frontend
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

# Convertisseur BSON -> JSON
def car_serializer(car) -> dict:
    return {
        "id": str(car["_id"]),
        "make": car["make"],
        "model": car["model"],
        "year": car["year"],
        "price": car["price"],
        "image": car.get("image", ""),
        "city_mpg": car["city_mpg"],
        "car_class": car.get("class", ""),  
        "combination_mpg": car["combination_mpg"],
        "cylinders": car["cylinders"],
        "displacement": car["displacement"],
        "drive": car["drive"],
        "fuel_type": car["fuel_type"],
        "highway_mpg": car["highway_mpg"],
        "transmission": car["transmission"]
    }

# 📌 3. Routes API 🚗
@app.post("/import-cars/")
async def import_cars():
    headers = {
        "X-Api-Key": API_NINJAS_KEY
    }
    params = {
        "make": "Ford"
    }
    
    # Ajoutez des logs pour vérifier les valeurs des variables
    print(f"API_NINJAS_KEY: {API_NINJAS_KEY}")
    print(f"API_NINJAS_URL: {API_NINJAS_URL}")
    print(f"Params: {params}")
    
    response = requests.get(API_NINJAS_URL, headers=headers, params=params)
    
    # Ajoutez des logs pour afficher le statut de la réponse et le contenu de la réponse en cas d'erreur
    if response.status_code != 200:
        print(f"Status Code: {response.status_code}")
        print(f"Response Content: {response.content}")
        raise HTTPException(status_code=response.status_code, detail="Erreur lors de la récupération des données de l'API")

    cars_data = response.json()
    for car_data in cars_data:
        car = Car(
            make=car_data["make"],
            model=car_data["model"],
            year=car_data["year"],
            price=car_data.get("price", 0.0),  # Utilisez get avec une valeur par défaut
            image=car_data.get("image", ""),  # Utilisez get avec une valeur par défaut
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

# ➤ Ajouter une voiture
@app.post("/cars/", response_model=dict)
async def add_car(car: Car):
    new_car = await cars_collection.insert_one(car.dict())
    return {"message": "Voiture ajoutée avec succès", "id": str(new_car.inserted_id)}

# ➤ Récupérer toutes les voitures avec filtres
@app.get("/cars/", response_model=List[dict])
async def get_cars(
    make: Optional[str] = Query(None, description="Filtrer par marque"),
    model: Optional[str] = Query(None, description="Filtrer par modèle"),
    year: Optional[int] = Query(None, description="Filtrer par année"),
    min_price: Optional[float] = Query(None, description="Prix minimum"),
    max_price: Optional[float] = Query(None, description="Prix maximum")
):
    filters = {}
    if make:
        filters["make"] = {"$regex": make, "$options": "i"}
    if model:
        filters["model"] = {"$regex": model, "$options": "i"}
    if year:
        filters["year"] = year
    if min_price or max_price:
        filters["price"] = {}
        if min_price:
            filters["price"]["$gte"] = min_price
        if max_price:
            filters["price"]["$lte"] = max_price

    cars = await cars_collection.find(filters).to_list(100)
    return [car_serializer(car) for car in cars]

# ➤ Récupérer une voiture par ID
@app.get("/cars/{car_id}", response_model=dict)
async def get_car(car_id: str):
    car = await cars_collection.find_one({"_id": ObjectId(car_id)})
    if not car:
        raise HTTPException(status_code=404, detail="Voiture non trouvée")
    return car_serializer(car)

# ➤ Supprimer une voiture
@app.delete("/cars/{car_id}")
async def delete_car(car_id: str):
    result = await cars_collection.delete_one({"_id": ObjectId(car_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Voiture non trouvée")
    return {"message": "Voiture supprimée"}

# ➤ Lancer le serveur
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)