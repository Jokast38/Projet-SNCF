import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Hero = ({ match }) => {
    const [car, setCar] = useState(null);

    useEffect(() => {
        fetchCar();
    }, []);

    const fetchCar = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/cars/${match.params.id}`);
            setCar(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createCarImage = (car, angle = '29') => {
        const url = new URL("https://cdn.imagin.studio/getimage");
        const { make, year, model } = car;

        url.searchParams.append("customer", "hrjavascript-mastery");
        url.searchParams.append("zoomType", "fullscreen");
        url.searchParams.append("paintdescription", "radiant-green");
        url.searchParams.append("modelFamily", model.split(" ")[0]);
        url.searchParams.append("make", make);
        url.searchParams.append("modelYear", `${year}`);
        url.searchParams.append("angle", `${angle}`);

        return `${url}`;
    };

    return (
        <div>
            {car ? (
                <div>
                    <h2>{car.make} {car.model}</h2>
                    <p>Année: {car.year}</p>
                    <p>Prix: {car.price} €</p>
                    <img src={createCarImage(car)} alt={`${car.make} ${car.model}`} />
                    <p>Consommation en ville: {car.city_mpg} MPG</p>
                    <p>Classe: {car.car_class}</p>
                    <p>Consommation combinée: {car.combination_mpg} MPG</p>
                    <p>Cylindres: {car.cylinders}</p>
                    <p>Déplacement: {car.displacement} L</p>
                    <p>Transmission: {car.transmission}</p>
                    <p>Type de carburant: {car.fuel_type}</p>
                    <p>Consommation sur autoroute: {car.highway_mpg} MPG</p>
                </div>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
};

export default Hero;