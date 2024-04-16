import React from "react";
import Card from 'react-bootstrap/Card';

function Things({things}) {
    return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      <div>
        <h1 style={{textAlign: "center", marginTop:"10px"}}>Things</h1>
      </div>
      {things.map((item, index) => (
        <Card style={{ width: '90vh', marginTop: "10px", borderColor:"black"}}>
          <Card.Body>
            Thing ip: {item.ip}
            Thing id: {item.thingID}
          </Card.Body>
        </Card>
        ))}
    </div>
    );
  }
  
  export default Things;