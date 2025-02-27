import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './css/CarUpdate.css';

const CarUpdate = () => {
  const { make, model, year } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    power: '',
    type: '',
    city_mpg: '',
    highway_mpg: '',
    combination_mpg: '',
    cylinders: '',
    displacement: '',
    transmission: '',
    fuel_type: ''
  });

  useEffect(() => {
    fetchCar();
  }, [make, model, year]);

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
      console.error('Error fetching car data', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar((prevCar) => ({
      ...prevCar,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/car/${make}/${model}/${year}`, car);
      navigate('/cars');
    } catch (error) {
      console.error('Error updating car data', error);
    }
  };

  return (
    <div className="car-update-container">
      <h1>Modifier les informations de la voiture</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Marque:
          <input type="text" name="make" value={car.make} onChange={handleChange} />
        </label>
        <label>
          Modèle:
          <input type="text" name="model" value={car.model} onChange={handleChange} />
        </label>
        <label>
          Année:
          <input type="number" name="year" value={car.year} onChange={handleChange} />
        </label>
        <label>
          Prix:
          <input type="number" name="price" value={car.price} onChange={handleChange} />
        </label>
        <label>
          Puissance:
          <input type="number" name="power" value={car.power} onChange={handleChange} />
        </label>
        <label>
          Type:
          <input type="text" name="type" value={car.type} onChange={handleChange} />
        </label>
        <label>
          Consommation en ville (MPG):
          <input type="number" name="city_mpg" value={car.city_mpg} onChange={handleChange} />
        </label>
        <label>
          Consommation sur autoroute (MPG):
          <input type="number" name="highway_mpg" value={car.highway_mpg} onChange={handleChange} />
        </label>
        <label>
          Consommation combinée (MPG):
          <input type="number" name="combination_mpg" value={car.combination_mpg} onChange={handleChange} />
        </label>
        <label>
          Cylindres:
          <input type="number" name="cylinders" value={car.cylinders} onChange={handleChange} />
        </label>
        <label>
          Déplacement (L):
          <input type="number" name="displacement" value={car.displacement} onChange={handleChange} />
        </label>
        <label>
          Transmission:
          <input type="text" name="transmission" value={car.transmission} onChange={handleChange} />
        </label>
        <label>
          Type de carburant:
          <input type="text" name="fuel_type" value={car.fuel_type} onChange={handleChange} />
        </label>
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default CarUpdate;