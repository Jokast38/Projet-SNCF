import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa'; // Importer l'icône de corbeille
import './css/CarList.css';
import $ from 'jquery';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel';

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [filters, setFilters] = useState({
        make: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 10;

    const fetchCars = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/cars', { params: filters });
            setCars(response.data);
        } catch (error) {
            console.error(error);
        }
    }, [filters]);

    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    useEffect(() => {
        const $slider = $('.slider');

        $slider.slick({
            arrows: false,
            dots: true,
            infinite: true,
            speed: 600,
            fade: true,
            focusOnSelect: true,
            customPaging: function(slider, i) {
                const color = $(slider.$slides[i]).data('color').split(',')[1];
                return `<a><svg width="100%" height="100%" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.215" stroke="${color}"></circle></svg><span style="background:${color}"></span></a>`;
            }
        }).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            const colors = $('figure', $slider).eq(nextSlide).data('color').split(',');
            const color1 = colors[0];
            const color2 = colors[1];
            $('.price, .btn').css({
                color: color1
            });
            changeBg(color1, color2);
            $('.btn').css({
                borderColor: color2
            });
        });

        function background(c1, c2) {
            return {
                background: `linear-gradient(15deg, ${c1} 50%, ${c2} 50.1%)`
            };
        }

        function changeBg(c1, c2) {
            $('div.bg').css(background(c1, c2)).fadeIn(700, function() {
                $('body').css(background(c1, c2));
                $('.bg').hide();
            });
            $('span.bg').css({
                background: `linear-gradient(135deg, ${c1}, ${c2})`
            });
        }
    }, []);

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

    // Fonction pour supprimer une voiture
    const deleteCar = async (carId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/cars/${carId}`);
            setCars(cars.filter(car => car.id !== carId));
        } catch (error) {
            console.error(error);
        }
    };

    // Calculer les voitures à afficher pour la page actuelle
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

    // Changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="car-list">
            <div className="search-container">
                <h2>Liste des voitures 🚗</h2>
                <div>
                    <input type="text" placeholder="Marque" onChange={(e) => setFilters({ ...filters, make: e.target.value })} />
                    <button onClick={fetchCars}>Rechercher 🔍</button>
                </div>
            </div>
            
            <div className="car-cards">
                {currentCars.map(car => (
                    <div key={car.id} className="car-card">
                        <Link to={`/car/${car.make}/${car.model}/${car.year}`}>
                            <h3>{car.make} {car.model}</h3>
                            <p>Année: {car.year}</p>
                            <p className="price">Prix: {car.price} €</p>
                            <img src={createCarImage(car)} alt={`${car.make} ${car.model}`} />
                            <p>Consommation en ville: {car.city_mpg} MPG</p>
                            <p>Classe: {car.car_class}</p>
                            <p>Consommation combinée: {car.combination_mpg} MPG</p>
                            <p>Cylindres: {car.cylinders}</p>
                            <p>Déplacement: {car.displacement} L</p>
                            <p>Transmission: {car.transmission}</p>
                            <p>Type de carburant: {car.fuel_type}</p>
                            <p>Consommation sur autoroute: {car.highway_mpg} MPG</p>
                        </Link>
                        <div className="card-actions">
                            <Link to={`/car/${car.make}/${car.model}/${car.year}`} className="btn">Voir Détails<span className="bg"></span></Link>
                            <FaTrash onClick={() => deleteCar(car.id)} className="btn-delete" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination">
                {Array.from({ length: Math.ceil(cars.length / carsPerPage) }, (_, index) => (
                    <button key={index + 1} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CarList;