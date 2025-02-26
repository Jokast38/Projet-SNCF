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

5. Lancez le serveur backend :
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

## Structure du projet
