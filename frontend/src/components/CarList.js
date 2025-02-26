import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [filters, setFilters] = useState({
        make: ''
    });

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/cars', { params: filters });
            setCars(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Liste des voitures 🚗</h2>
            <input type="text" placeholder="Marque" onChange={(e) => setFilters({ ...filters, make: e.target.value })} />
            <button onClick={fetchCars}>Rechercher 🔍</button>
            
            <div>
                {cars.map(car => (
                    <div key={car.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
                        <h3>{car.make} {car.model}</h3>
                        <p>Année: {car.year}</p>
                        <p>Prix: {car.price} €</p>
                        {car.image && <img src={car.image} alt={car.model} width="200" />}
                        <p>Consommation en ville: {car.city_mpg} MPG</p>
                        <p>Classe: {car.car_class}</p>
                        <p>Consommation combinée: {car.combination_mpg} MPG</p>
                        <p>Cylindres: {car.cylinders}</p>
                        <p>Déplacement: {car.displacement} L</p>
                        <p>Transmission: {car.transmission}</p>
                        <p>Type de carburant: {car.fuel_type}</p>
                        <p>Consommation sur autoroute: {car.highway_mpg} MPG</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarList;