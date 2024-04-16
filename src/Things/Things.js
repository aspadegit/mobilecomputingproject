import React from "react";
import Card from 'react-bootstrap/Card';

let tempArray = [{name: "Thing 1"}, {name: "Thing 2"}]

function Things() {
    return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      <div>
        <h1 style={{textAlign: "center", marginTop:"10px"}}>Things</h1>
      </div>
      {tempArray.map((item, index) => (
        <Card style={{ width: '90vh', marginTop: "10px", borderColor:"black"}}>
          <Card.Body>
            Thing Name: {item.name}
          </Card.Body>
        </Card>
        ))}
    </div>
    );
  }
  
  export default Things;