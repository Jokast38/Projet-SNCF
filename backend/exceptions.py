from fastapi import HTTPException

class CarNotFoundException(HTTPException):
    def __init__(self, car_id: str):
        super().__init__(status_code=404, detail=f"Voiture avec l'ID {car_id} non trouvée")

class CarUpdateException(HTTPException):
    def __init__(self, make: str, model: str, year: int):
        super().__init__(status_code=404, detail=f"Voiture avec la marque {make}, le modèle {model} et l'année {year} non trouvée ou non mise à jour")