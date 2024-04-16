import React from "react";
import Card from 'react-bootstrap/Card';

let tempArray = [{name: "Thing 1"}, {name: "Thing 2"}]

function Things() {
    return (
    <div>
      {tempArray.map((item, index) => (
          <Card>
            <Card.Body>
              Thing Name: {item.name}
            </Card.Body>
          </Card>
          ))}
    </div>
    );
  }
  
  export default Things;