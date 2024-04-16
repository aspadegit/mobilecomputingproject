import React from "react";
import Card from 'react-bootstrap/Card';

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