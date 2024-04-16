import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function AppManager({ show, onClose }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Apps Manager</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
      </Modal.Body>
    </Modal>
  );
}

export default AppManager;
