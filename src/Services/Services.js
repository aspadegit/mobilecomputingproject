import React from "react";
import Card from 'react-bootstrap/Card';

let tempArray = [{name: "service1"}, {name: "Service 2"}]

function Services() {
    return (
    <div>
      {tempArray.map((item, index) => (
          <Card>
            <Card.Body>
              Service Name: {item.name}
            </Card.Body>
          </Card>
          ))}
    </div>
    );
  }
  
  export default Services;