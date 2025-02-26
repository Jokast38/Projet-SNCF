import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CarList from './components/CarList';
import Hero from './components/Hero';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CarList />} />
                <Route path="/car/:id" element={<Hero />} />
            </Routes>
        </Router>
    );
}

export default App;