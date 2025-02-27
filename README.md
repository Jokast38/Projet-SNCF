# Projet SNCF

Ce projet est une application web pour gérer une liste de voitures, permettant d'ajouter, afficher et supprimer des voitures. L'application est construite avec React pour le frontend et FastAPI pour le backend.

## Fonctionnalités

- **Liste des voitures** : Affiche une liste de voitures avec des détails tels que la marque, le modèle, l'année, le prix, etc.
- **Ajouter une voiture** : Formulaire pour ajouter une nouvelle voiture à la liste.
- **Détails de la voiture** : Affiche les détails d'une voiture spécifique, y compris des images sous différents angles.
- **Supprimer une voiture** : Permet de supprimer une voiture de la liste.

## Prérequis

- Node.js (version 14 ou supérieure)
- Python (version 3.8 ou supérieure)
- MongoDB
- WAMP (ou tout autre serveur web local)

## Installation

### Backend

1. Clonez le dépôt :
    ```bash
    git clone https://github.com/votre-utilisateur/projet-sncf.git
    cd projet-sncf/backend
    ```

2. Configurez les variables d'environnement en créant un fichier `.env` :
    ```env
    MONGO_URI=mongodb://localhost:27017
    API_NINJAS_KEY=your_api_ninjas_key
    API_NINJAS_URL=https://api.api-ninjas.com/v1/cars
    ```

3. Installez les dépendances :
    ```bash
    pip install fastapi
    pip install uvicorn
    pip install pymongo
    pip install motor
    pip install python-dotenv
    pip install requests
    ```

4. Lancez le serveur backend :
    ```bash
    uvicorn main:app --reload
    ```

### Frontend

1. Accédez au répertoire frontend :
    ```bash
    cd ../frontend
    ```

2. Installez les dépendances :
    ```bash
    npm install
    ```

3. Lancez le serveur frontend :
    ```bash
    npm start
    ```

## Utilisation

1. Ouvrez votre navigateur et accédez à `http://localhost:3000` pour voir l'application en action.
2. Utilisez le formulaire pour ajouter une nouvelle voiture.
3. Cliquez sur une voiture dans la liste pour voir ses détails.
4. Utilisez le bouton "Voir Détails" pour accéder à la page Hero de la voiture.

## Importer un jeu de données

Pour importer un jeu de données dans la base de données, vous pouvez utiliser le script `fetch_and_insert`. Ce script récupère des données depuis une API et les insère dans la base de données MongoDB.

### Utilisation du script `fetch_and_insert`

1. Accédez au répertoire backend :
    ```bash
    cd backend
    ```

2. Exécutez le script `fetch_and_insert` :
    ```bash
    python fetch_and_insert.py
    ```

### Explication du code

Voici une explication du code du script `fetch_and_insert.py` :

```python
import os
import requests
from pymongo import MongoClient
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Récupérer les variables d'environnement
MONGO_URI = os.getenv("MONGO_URI")
API_NINJAS_KEY = os.getenv("API_NINJAS_KEY")
API_NINJAS_URL = os.getenv("API_NINJAS_URL")

# Connexion à MongoDB
client = MongoClient(MONGO_URI)
db = client["project_cars"]
cars_collection = db["cars"]

# Fonction pour récupérer les données depuis l'API et les insérer dans la base de données
def fetch_and_insert():
    headers = {
        "X-Api-Key": API_NINJAS_KEY
    }
    params = {
        "make": "Toyota",
        "model": "Camry",
        "year": 2020
    }
    response = requests.get(API_NINJAS_URL, headers=headers, params=params)
    if response.status_code == 200:
        cars_data = response.json()
        for car_data in cars_data:
            car = {
                "make": car_data["make"],
                "model": car_data["model"],
                "year": car_data["year"],
                "price": car_data.get("price", 0.0),
                "image": car_data.get("image", ""),
                "city_mpg": car_data["city_mpg"],
                "car_class": car_data["class"],
                "combination_mpg": car_data["combination_mpg"],
                "cylinders": car_data["cylinders"],
                "displacement": car_data["displacement"],
                "drive": car_data["drive"],
                "fuel_type": car_data["fuel_type"],
                "highway_mpg": car_data["highway_mpg"],
                "transmission": car_data["transmission"]
            }
            cars_collection.insert_one(car)
        print("Données importées avec succès")
    else:
        print("Erreur lors de la récupération des données de l'API")

if __name__ == "__main__":
    fetch_and_insert()
```

### Explication

- **Chargement des variables d'environnement** : Le script utilise `dotenv` pour charger les variables d'environnement depuis un fichier `.env`.
- **Connexion à MongoDB** : Le script se connecte à la base de données MongoDB en utilisant l'URI spécifié dans les variables d'environnement.
- **Récupération des données depuis l'API** : Le script envoie une requête GET à l'API spécifiée pour récupérer les données des voitures.
- **Insertion des données dans MongoDB** : Les données récupérées sont insérées dans la collection `cars` de la base de données MongoDB.

Avec ces instructions, vous pouvez facilement importer un jeu de données dans la base de données en utilisant le script `fetch_and_insert`.