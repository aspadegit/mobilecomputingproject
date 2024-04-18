import React from "react";
import Card from 'react-bootstrap/Card';
import { Spinner } from "react-bootstrap";

let tempArray = [{name: "def 2"}, {name: "abc"}, {name: "bcd"}]
tempArray.sort(compare)

function compare( a, b ) { //put services in alphabetical order
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}

const loading = () => {
  return (
    <div style={{display: "flex", flexDirection: "row"}}>
      <div>Scanning for Services...</div>
      <Spinner animation="border" variant="primary" style={{marginLeft: "10px"}}/>  
    </div>
  );
}

const mapServices = (services) => {
  return (
    <div>
      {services.map((item, index) => (
      <Card style={{ width: '90vh', marginTop: "10px", borderColor:"black"}}>
        <Card.Body>
          <strong>Thing ID: </strong> {item.thingID}
          <br/>
          <strong>Name: </strong> {item.serviceName}
          <br/>
          <strong>Inputs: </strong> {item.serviceInput.map((input, index2) => (
              <div key={index2} style={{paddingLeft: '20px'}}>&#8226;{input}</div>
            ))}
          <strong>Output: </strong> {item.serviceOutput}
        </Card.Body>
      </Card>
      ))}
    </div>
  );
}

function Services({services}) {
  return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      <div>
        <h1 style={{textAlign: "center", marginTop:"10px"}}>Services</h1>
      </div>
      {services.length === 0 ? loading() : mapServices(services)}
    </div>
  );  
  }
  
  export default Services;