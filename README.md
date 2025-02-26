# Projet SNCF

Ce projet est une application web pour gérer et afficher des informations sur les voitures. Il comprend un backend développé avec FastAPI et un frontend développé avec React.

## Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre machine :

- Python 3.7+
- Node.js et npm
- MongoDB

## Installation

### Backend

1. Clonez le dépôt :
    ```sh
    git clone https://github.com/votre-utilisateur/projet-sncf.git
    cd projet-sncf/backend
    ```

2. Créez un environnement virtuel et activez-le :
    ```sh
    python -m venv env
    source env/bin/activate  # Sur Windows, utilisez `env\Scripts\activate`
    ```

3. Installez les dépendances :
    ```sh
    pip install -r requirements.txt
    ```

4. Créez un fichier `.env` dans le répertoire [backend](http://_vscodecontentref_/0) et ajoutez les variables d'environnement nécessaires :
    ```env
    MONGO_URI=your_mongo_uri
    API_NINJAS_KEY=your_api_ninjas_key
    API_NINJAS_URL=https://api.api-ninjas.com/v1/cars
    ```

5. Démarrez le serveur FastAPI :
    ```sh
    uvicorn main:app --reload
    ```

### Frontend

1. Accédez au répertoire [frontend](http://_vscodecontentref_/1) :
    ```sh
    cd ../frontend
    ```

2. Installez les dépendances :
    ```sh
    npm install
    ```

3. Démarrez l'application React :
    ```sh
    npm start
    ```

## Utilisation

1. Ouvrez votre navigateur et accédez à `http://localhost:3000` pour voir l'application frontend.
2. Le backend sera accessible à `http://localhost:8000`.

## Fonctionnalités

- Ajouter des voitures via l'API `api-ninjas`.
- Afficher la liste des voitures avec des filtres (marque, modèle, année, prix minimum, prix maximum).

## Structure du projet
