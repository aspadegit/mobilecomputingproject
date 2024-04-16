import React from "react";
import Card from 'react-bootstrap/Card';

let tempArray = [{name: "Relationship 2"}, {name: "Relationship 2"}]

function Relationships() {
    return (
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <div>
          <h1 style={{textAlign: "center", marginTop:"10px"}}>Relationships</h1>
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
  
  export default Relationships;