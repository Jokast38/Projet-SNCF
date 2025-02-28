import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import './css/Dashboard.css';

const Dashboard = () => {
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [averagePowerByMakeModel, setAveragePowerByMakeModel] = useState([]);
  const [vehiclesByYear, setVehiclesByYear] = useState([]);
  const [vehiclesByMake, setVehiclesByMake] = useState([]);
  const [vehiclesByType, setVehiclesByType] = useState([]);
  const [vehiclesByFuelType, setVehiclesByFuelType] = useState([]);
  const [vehiclesByClass, setVehiclesByClass] = useState([]);
  const [vehiclesByTransmission, setVehiclesByTransmission] = useState([]);
  const [vehiclesByDrive, setVehiclesByDrive] = useState([]);
  const [vehiclesByCityMpg, setVehiclesByCityMpg] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const totalVehiclesResponse = await axios.get('http://127.0.0.1:8000/total-vehicles');
      console.log('Total Vehicles:', totalVehiclesResponse.data);
      setTotalVehicles(totalVehiclesResponse.data.total);

      const averagePowerResponse = await axios.get('http://127.0.0.1:8000/average-power-by-make-model');
      console.log('Average Power by Make/Model:', averagePowerResponse.data);
      setAveragePowerByMakeModel(averagePowerResponse.data);

      const vehiclesByYearResponse = await axios.get('http://127.0.0.1:8000/vehicles-by-year');
      console.log('Vehicles by Year:', vehiclesByYearResponse.data);
      setVehiclesByYear(vehiclesByYearResponse.data);

      const vehiclesByMakeResponse = await axios.get('http://127.0.0.1:8000/vehicles-by-make');
      console.log('Vehicles by Make:', vehiclesByMakeResponse.data);
      setVehiclesByMake(vehiclesByMakeResponse.data);

      const vehiclesByTypeResponse = await axios.get('http://127.0.0.1:8000/vehicles-by-type');
      console.log('Vehicles by Type:', vehiclesByTypeResponse.data);
      setVehiclesByType(vehiclesByTypeResponse.data);

      const vehiclesByFuelTypeResponse = await axios.get('http://127.0.0.1:8000/vehicles-by-fuel-type');
      console.log('Vehicles by Fuel Type:', vehiclesByFuelTypeResponse.data);
      setVehiclesByFuelType(vehiclesByFuelTypeResponse.data);

      const vehiclesByClassResponse = await axios.get('http://127.0.0.1:8000/vehicles-by-class');
      console.log('Vehicles by Class:', vehiclesByClassResponse.data);
      setVehiclesByClass(vehiclesByClassResponse.data);

      const vehiclesByTransmissionResponse = await axios.get('http://127.0.0.1:8000/vehicles-by-transmission');
      console.log('Vehicles by Transmission:', vehiclesByTransmissionResponse.data);
      setVehiclesByTransmission(vehiclesByTransmissionResponse.data);

      const vehiclesByDriveResponse = await axios.get('http://127.0.0.1:8000/vehicles-by-drive');
      console.log('Vehicles by Drive:', vehiclesByDriveResponse.data);
      setVehiclesByDrive(vehiclesByDriveResponse.data);

      const vehiclesByCityMpgResponse = await axios.get('http://127.0.0.1:8000/vehicles-by-city-mpg');
      console.log('Vehicles by City MPG:', vehiclesByCityMpgResponse.data);
      setVehiclesByCityMpg(vehiclesByCityMpgResponse.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="dashboard-container">
      <h1>Tableau de Bord</h1>
      <div className="dashboard-section">
        <h2>Nombre total de véhicules</h2>
        <p>{totalVehicles}</p>
      </div>
      <div className="dashboard-section">
        <h2>Moyenne des puissances par marque/modèle</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={averagePowerByMakeModel}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id.make" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="average_power" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="dashboard-section">
        <h2>Répartition des véhicules par année</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={vehiclesByYear}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="dashboard-section">
        <h2>Répartition des véhicules par marque</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vehiclesByMake}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="dashboard-section">
        <h2>Répartition des types de véhicules</h2>
        <div className="chart-container">
          <ResponsiveContainer width="50%" height={300}>
            <PieChart>
              <Pie
                data={vehiclesByType}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {vehiclesByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="50%" height={300}>
            <BarChart data={vehiclesByMake}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* New aggregations */}
        <div className="dashboard-section">
            <h2>Répartition des véhicules par type de carburant</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehiclesByFuelType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-section">
            <h2>Répartition des véhicules par classe</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehiclesByClass}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-section">
            <h2>Répartition des véhicules par transmission</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehiclesByTransmission}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-section">
            <h2>Répartition des véhicules par type de traction</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehiclesByDrive}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-section">
            <h2>Répartition des véhicules par économie de carburant (ville)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vehiclesByCityMpg}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#FF8042" />
              </LineChart>
            </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;