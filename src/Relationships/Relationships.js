import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Trash } from 'react-bootstrap-icons';

function Relationships({ services }) {
  const [showModal, setShowModal] = useState(false);
  const [relationships, setRelationships] = useState([]);
  const [relationshipName, setRelationshipName] = useState('');
  const [relationshipType, setRelationshipType] = useState('orderBased');
  const [selectedService1, setSelectedService1] = useState('');
  const [selectedService2, setSelectedService2] = useState('');
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);

  useEffect(() => {
    if (!showModal) {
      setRelationshipName('');
      setRelationshipType('orderBased');
      setSelectedService1('');
      setSelectedService2('');
    }
  }, [showModal]);
  
  useEffect(() => {
    setIsAddButtonDisabled(
      relationshipName === '' ||
      selectedService1 === '' ||
      selectedService2 === ''
    );
  }, [relationshipName, selectedService1, selectedService2]);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const addRelationship = () => {
    const isNameDuplicate = relationships.some(relationship => relationship.name === relationshipName);
    if (isNameDuplicate) {
      alert('Relationship name already exists!');
      return;
    }
    const newRelationship = {
      name: relationshipName,
      type: relationshipType,
      service1: selectedService1,
      service2: selectedService2
    };
    setRelationships([...relationships, newRelationship]);
    handleCloseModal();
  };

  const deleteRelationship = (index) => {
    const updatedRelationships = [...relationships];
    updatedRelationships.splice(index, 1);
    setRelationships(updatedRelationships);
  };

  return (
    <div>
      <h1 style={{textAlign: "center", marginTop:"10px"}}>Your Relationships</h1>

      {relationships.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>No relationships yet</p>
        </div>
      )}

      {/* Render existing relationships */}
      {relationships.map((relationship, index) => (
        <Card key={index} style={{ margin: "20px", borderColor:"black"}}>
          <Card.Body>
            <strong>Name: </strong> {relationship.name}
            <br/>
            <strong>Type: </strong> {relationship.type}
            <br/>
            <strong>Service A: </strong> {relationship.service1}
            <br/>
            <strong>Service B: </strong> {relationship.service2}
            <br/>
            <Button style={{float: 'right'}} variant="secondary" onClick={() => deleteRelationship(index)}><Trash/></Button>
          </Card.Body>
        </Card>
      ))}

      <br/><Button style={{float: 'right', marginRight: '20px'}} onClick={handleShowModal}>Add Relationship</Button>


      {/* Render the modal for adding new relationships */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Relationship</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="relationshipName">
            <Form.Label>Relationship Name:</Form.Label>
            <Form.Control
              type="text"
              value={relationshipName}
              onChange={(e) => setRelationshipName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="relationshipType">
            <Form.Label>Type:</Form.Label>
            <Form.Check
              type="switch"
              id="orderBasedSwitch"
              label="Order Based"
              checked={relationshipType === 'orderBased'}
              onChange={() => setRelationshipType('orderBased')}
            />
            <Form.Check
              type="switch"
              id="conditionalSwitch"
              label="Conditional"
              checked={relationshipType === 'conditional'}
              onChange={() => setRelationshipType('conditional')}
            />
          </Form.Group>
          <Form.Group controlId="selectedService1">
            <Form.Label>Select Service 1:</Form.Label>
            <Form.Control
              as="select"
              value={selectedService1}
              onChange={(e) => setSelectedService1(e.target.value)}
            >
              <option value=""></option>
              {services.map((service, index) => (
                <option key={index} value={service.serviceName}>{service.serviceName}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="selectedService2">
            <Form.Label>Select Service 2:</Form.Label>
            <Form.Control
              as="select"
              value={selectedService2}
              onChange={(e) => setSelectedService2(e.target.value)}
            >
              <option value=""></option>
              {services.map((service, index) => (
                <option key={index} value={service.serviceName}>{service.serviceName}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={addRelationship} disabled={isAddButtonDisabled}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Relationships;
