import React from "react";
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner'

const loading = () => {
  return (
    <div style={{display: "flex", flexDirection: "row"}}>
      <div>Scanning for Things...</div>
      <Spinner animation="border" variant="primary" style={{marginLeft: "10px"}}/>  
    </div>
  );
}

const mapThings = (things) => {
  return(
    <div>
    {things.map((item, index) => (
      <Card style={{ width: '90vh', marginTop: "10px", borderColor:"black"}}>
        <Card.Body>
          <strong>IP: </strong> {item.ip}
          <br/>
          <strong>ID: </strong>{item.thingID}
        </Card.Body>
      </Card>
      ))}
    </div>
    
  );
}

function Things({things}) {
    return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      <div>
        <h1 style={{textAlign: "center", marginTop:"10px"}}>Things</h1>
      </div>
      {things.length === 0 ? loading() : mapThings(things)}
    </div>
    );
  }
  
  export default Things;