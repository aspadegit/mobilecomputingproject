import React from "react";
import Card from 'react-bootstrap/Card';

let tempArray = [{name: "service1"}, {name: "Service 2"}]



function Services() {
  return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      <div>
        <h1 style={{textAlign: "center", marginTop:"10px"}}>Services</h1>
      </div>
      {tempArray.map((item, index) => (
        <Card style={{ width: '90vh', marginTop: "10px", borderColor:"black"}}>
          <Card.Body>
            Service Name: {item.name}
          </Card.Body>
        </Card>
        ))}
    </div>
  );  
  }
  
  export default Services;