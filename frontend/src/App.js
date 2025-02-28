import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CarList from './components/CarList';
import Hero from './components/Hero';
import CarForm from './components/CarForm';
<<<<<<< HEAD

=======
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CarUpdate from './components/CarUpdate';
import Footer from './components/Footer';
>>>>>>> jokast

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CarList />} />
                <Route path="/car/:make/:model/:year" element={<Hero />} />
                <Route path="/add-car" element={<CarForm />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;