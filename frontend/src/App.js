import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CarList from './components/CarList';
import Hero from './components/Hero';
import CarForm from './components/CarForm';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CarUpdate from './components/CarUpdate';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <Navbar />
            <ToastContainer />
            <Routes>
                <Route path="/" element={<CarList />} />
                <Route path="/car/:make/:model/:year" element={<Hero />} />
                <Route path="/add-car" element={<CarForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/car/:make/:model/:year/update" element={<CarUpdate />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;