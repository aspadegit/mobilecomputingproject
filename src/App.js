import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Apps from './Apps';
import Relationships from './Relationships';
import Services from './Services';
import Things from './Things';
import NavigationBar from './NavigationBar';
import axios from 'axios';

function App() {

  const [things, setThings] = useState([]);
  const [services, setServices] = useState([]);
  const [relationships, setRelationships] = useState([]);

  useEffect(() => {
    const dataTimer = setInterval(() => {
      axios.get('http://localhost:3001/getThings') 
      .then(response => {
        setThings(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }, 1000);
    return () => clearInterval(dataTimer);
  }, []);

  useEffect(() => {
    const dataTimer = setInterval(() => {
      axios.get('http://localhost:3001/getServices') 
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }, 1000);
    return () => clearInterval(dataTimer);
  }, []);

  return (
    <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Things things={things}/>} />
          <Route path="/Services" element={<Services services={services}/>} />
          <Route path="/Relationships" element={<Relationships services={services}/>} />
          <Route path="/Apps" element={<Apps/>} />
        </Routes>
    </Router>
  );
}

export default App;