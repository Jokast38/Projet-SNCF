import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope } from 'react-icons/fa';
import './css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h1 className="logo-text"><span>Car</span>Net</h1>
                    <p>
                        CarNet est une plateforme dédiée à la vente et à l'achat de voitures. Nous offrons une large gamme de véhicules pour répondre à tous vos besoins.
                    </p>
                    <div className="contact">
                        <span><FaPhone /> &nbsp; +123-456-789</span>
                        <span><FaEnvelope /> &nbsp; info@carnet.com</span>
                    </div>
                    <div className="socials">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                    </div>
                </div>

                <div className="footer-section links">
                    <h2>Liens rapides</h2>
                    <br />
                    <ul>
                        <a href="/"><li>Accueil</li></a>
                        <a href="/about"><li>À propos</li></a>
                        <a href="/services"><li>Services</li></a>
                        <a href="/contact"><li>Contact</li></a>
                    </ul>
                </div>

                <div className="footer-section contact-form">
                    <h2>Contactez-nous</h2>
                    <br />
                    <form action="index.html" method="post">
                        <input type="email" name="email" className="text-input contact-input" placeholder="Votre email..." />
                        <textarea name="message" className="text-input contact-input" placeholder="Votre message..."></textarea>
                        <button type="submit" className="btn btn-big">
                            <FaEnvelope />
                            Envoyer
                        </button>
                    </form>
                </div>
            </div>

            <div className="footer-bottom">
                &copy; carnet.com | Designed by CarNet Team
            </div>
        </footer>
    );
};

export default Footer;