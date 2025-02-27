import React from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Projet CARSNET
                </Link>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/" className="nav-links">
                            Accueil
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/add-car" className="nav-links">
                            Ajouter une voiture
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/dashboard" className="nav-links">
                            Tableau de bord
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;