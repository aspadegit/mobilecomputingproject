import React, { useState } from 'react';
import { Button, Modal, Card } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import Blockly from 'blockly';

function AppManager({ show, onClose, onFileUpload  }) {
    const [isActive, setIsActive] = useState(false);
    const [apps, setApps] = useState([]);

    const handleActivate = () => {
        if (isActive) {
            // Functionality for stopping the current app
            console.log('Stopping the current app');
        } else {
            // Functionality for activating the current app
            console.log('Activating the current app');
        }
        setIsActive(!isActive);
    };

    const handleDeleteApp = (index) => {
        // Logic to delete an app from the list
        const updatedApps = [...apps];
        updatedApps.splice(index, 1);
        setApps(updatedApps);
    };

    const handleAddApp = () => {
        const appName = prompt("Enter a name for the app:");
        if (appName) {
            // Get XML data of the Blockly workspace
            const xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
            const xmlText = Blockly.Xml.domToText(xml);
            const newApp = { name: appName, xml: xmlText };
            // Add the new app object to the apps array
            setApps([...apps, newApp]);
        }
    };

    const handleUploadApp = (index) => {
        onFileUpload(apps[index].xml);
    };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title><h2>App Manager</h2></Modal.Title>
      </Modal.Header>
      <Modal.Body style={{textAlign:'center'}}>
        <Button style={{width:'200px'}} onClick={handleAddApp}>Save Current App</Button><br/><br/>
        <Button onClick={handleActivate} variant={isActive ? 'danger' : 'primary'} style={{ color: 'white', width:'200px'}}>{isActive ? 'Stop' : 'Activate'} Current App</Button><br/><br/>
        <h3 style={{float: 'left'}}>Your Apps:</h3> <br/><br/>
        <ul style={{listStyleType: 'none', padding: 0}}>
            {apps.map((app, index) => (
                <li key={index}>
                <Card style={{margin: '10px', display: 'flex', alignItems: 'center', padding: '10px'}}>
                    <span style={{marginRight: 'auto'}}>{app.name}</span>
                    <div style={{ marginLeft: 'auto' }}>
                        <Button variant="primary" style={{ marginRight: '5px' }} onClick={() => handleUploadApp(index)}>Upload</Button>
                        <Button variant="secondary" onClick={() => handleDeleteApp(index)}><Trash /></Button>
                    </div>
                </Card>
            </li>
            ))}
        </ul>
      </Modal.Body>
    </Modal>
  );
}

export default AppManager;
