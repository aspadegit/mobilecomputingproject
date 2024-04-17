import React from "react";
import Card from 'react-bootstrap/Card';
import { Spinner } from "react-bootstrap";

let tempArray = [{name: "Relationship 2"}, {name: "Relationship 2"}]

const loading = () => {
  return (
    <div style={{display: "flex", flexDirection: "row"}}>
      <div>Scanning for Relationships...</div>
      <Spinner animation="border" variant="primary" style={{marginLeft: "10px"}}/>  
    </div>
  );
}

const mapRelationships = (relationships) => {
  return (
    <div>
      {relationships.map((item, index) => (
      <Card style={{ width: '90vh', marginTop: "10px", borderColor:"black"}}>
        <Card.Body>
          Relationship Name: {item.name}
        </Card.Body>
      </Card>
      ))}
    </div>
  );
}

function Relationships({relationships}) {
    return (
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <div>
          <h1 style={{textAlign: "center", marginTop:"10px"}}>Relationships</h1>
        </div>
        {relationships.length === 0 ? loading() : mapRelationships(tempArray)}
      </div>
    );
  }
  
  export default Relationships;