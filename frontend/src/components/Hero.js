import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import './css/Hero.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Hero = () => {
    const { make, model, year } = useParams();
    const [car, setCar] = useState(null);

<<<<<<< HEAD
    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/cars`, {
                    params: { make, model, year }
                });
                if (response.data.length > 0) {
                    setCar(response.data[0]);
                } else {
                    console.error("No car found with the specified parameters.");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchCar();
    }, [make, model, year]);

=======
    const fetchCar = useCallback(async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/cars`, {
                params: { make, model, year }
            });
            if (response.data.length > 0) {
                setCar(response.data[0]);
            } else {
                console.error("No car found with the specified parameters.");
            }
        } catch (error) {
            console.error(error);
        }
    }, [make, model, year]);

    useEffect(() => {
        fetchCar();
    }, [fetchCar]);

>>>>>>> jokast
    const createCarImage = (car, angle = '29') => {
        const url = new URL("https://cdn.imagin.studio/getimage");
        const { make, year, model } = car;

        if (!model) {
            console.error("Model is undefined for car:", car);
            return "";
        }

        url.searchParams.append("customer", "hrjavascript-mastery");
        url.searchParams.append("zoomType", "fullscreen");
        url.searchParams.append("paintdescription", "radiant-green");
        url.searchParams.append("modelFamily", model.split(" ")[0]);
        url.searchParams.append("make", make);
        url.searchParams.append("modelYear", `${year}`);
        url.searchParams.append("angle", `${angle}`);

        return `${url}`;
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div className="hero-container">
            {car ? (
                <div className="hero-card">
                    <h2>{car.make} {car.model}</h2>
                    <p className="price">Prix: {car.price} €</p>
                    <Slider {...settings}>
                        <div>
                            <img src={createCarImage(car, '29')} alt={`${car.make} ${car.model}`} />
                        </div>
                        <div>
                            <img src={createCarImage(car, '33')} alt={`${car.make} ${car.model}`} />
                        </div>
                        <div>
                            <img src={createCarImage(car, '34')} alt={`${car.make} ${car.model}`} />
                        </div>
                       
                    </Slider>
                    <div className="info">
                        <span className="info-title">Année:</span>
                        <span>{car.year}</span>
                    </div>
                    <div className="info">
                        <span className="info-title">Consommation en ville:</span>
                        <span>{car.city_mpg} MPG</span>
                    </div>
                    <div className="info">
                        <span className="info-title">Classe:</span>
                        <span>{car.car_class}</span>
                    </div>
                    <div className="info">
                        <span className="info-title">Consommation combinée:</span>
                        <span>{car.combination_mpg} MPG</span>
                    </div>
                    <div className="info">
                        <span className="info-title">Cylindres:</span>
                        <span>{car.cylinders}</span>
                    </div>
                    <div className="info">
                        <span className="info-title">Déplacement:</span>
                        <span>{car.displacement} L</span>
                    </div>
                    <div className="info">
                        <span className="info-title">Transmission:</span>
                        <span>{car.transmission}</span>
                    </div>
                    <div className="info">
                        <span className="info-title">Type de carburant:</span>
                        <span>{car.fuel_type}</span>
                    </div>
                    <div className="info">
                        <span className="info-title">Consommation sur autoroute:</span>
                        <span>{car.highway_mpg} MPG</span>
                    </div>
                </div>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
};

export default Hero;