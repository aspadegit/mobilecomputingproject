import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Apps from './Apps';
import Relationships from './Relationships';
import Services from './Services';
import Things from './Things';
import NavigationBar from './NavigationBar';

function App() {
  return (
    <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Things/>} />
          <Route path="/Services" element={<Services/>} />
          <Route path="/Relationships" element={<Relationships/>} />
          <Route path="/Apps" element={<Apps/>} />
        </Routes>
    </Router>
  );
}

export default App;