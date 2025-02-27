import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './css/CarForm.css';

const CarForm = () => {
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/import-car', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            console.log(response.data);
            toast.success('Voiture ajoutée avec succès');
            setFormData({
                make: '',
                model: '',
                year: ''
            });
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de l\'ajout de la voiture');
        }
    };

    return (
        <div className="car-form-container">
            <div className="car-form">
                <h2>Ajouter une voiture</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Marque:</label>
                        <input type="text" name="make" value={formData.make} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Modèle:</label>
                        <input type="text" name="model" value={formData.model} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Année:</label>
                        <input type="number" name="year" value={formData.year} onChange={handleChange} required />
                    </div>
                    <button type="submit">Ajouter Voiture</button>
                </form>
            </div>
        </div>
    );
};

export default CarForm;