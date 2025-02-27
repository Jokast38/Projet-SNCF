import requests
import json
import time
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()

API_NINJAS_URL = os.getenv("API_NINJAS_URL")
API_NINJAS_KEY = os.getenv("API_NINJAS_KEY")
MONGO_URI = os.getenv("MONGO_URI")

# Connexion à MongoDB
client = MongoClient(MONGO_URI)
db = client["project_cars"]
cars_collection = db["cars"]

# Liste des marques, modèles et années à utiliser pour les requêtes
makes = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "BMW", "Mercedes", "Audi", "Volkswagen", "Hyundai"]
models = ["Camry", "Civic", "F-150", "Silverado", "Altima", "3 Series", "C-Class", "A4", "Golf", "Elantra"]
years = [2020, 2021, 2022, 2023]

# Fonction pour récupérer les données de l'API
def fetch_car_data(make, model, year):
    headers = {
        "X-Api-Key": API_NINJAS_KEY
    }
    params = {
        "make": make,
        "model": model,
        "year": year
    }
    response = requests.get(API_NINJAS_URL, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Erreur lors de la récupération des données pour {make} {model} {year}: {response.status_code}")
        return None

# Boucle pour envoyer les requêtes, récupérer les données et les insérer dans MongoDB
for make in makes:
    for model in models:
        for year in years:
            car_data = fetch_car_data(make, model, year)
            if car_data:
                for car in car_data:
                    # Ajouter des champs par défaut si manquants
                    car["make"] = make
                    car["model"] = model
                    car["year"] = year
                    if "price" not in car:
                        car["price"] = 0.0
                    if "power" not in car:
                        car["power"] = 0.0
                    if "type" not in car:
                        car["type"] = "Unknown"
                    cars_collection.insert_one(car)
            # Attendre 1 seconde entre les requêtes pour éviter de surcharger l'API
            time.sleep(1)

print("Données des voitures récupérées et insérées dans MongoDB")