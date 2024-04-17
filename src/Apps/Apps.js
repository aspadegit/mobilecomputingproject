// Apps.js
import React, { useRef, useEffect, useState } from 'react';
import Blockly from 'blockly';
import { Button } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { Modal } from 'react-bootstrap'
import AppManager from '../AppManager';

function Apps() {
  const workspaceRef = useRef(null);
  const [appSaved, setAppSaved] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [showManager, setShowManager] = useState(false);

  useEffect(() => {
    const toolboxXml = `
      <xml id="toolbox" style="display: none">
        <category name="Logic" colour="#5C81A6">
          <block type="logic_compare"></block>
          <block type="logic_operation"></block>
          <block type="logic_negate"></block>
        </category>
        <category name="Loops" colour="#5CA65C">
          <block type="controls_repeat_ext"></block>
          <block type="controls_whileUntil"></block>
        </category>
        <category name="Math" colour="#5C68A6">
          <block type="math_number"></block>
          <block type="math_arithmetic"></block>
        </category>
        <category name="Text" colour="#5CA68D">
          <block type="text"></block>
          <block type="text_length"></block>
        </category>
        <category name="Variables" colour="#A65C81" custom="VARIABLE"></category>
      </xml>
    `;
  
    const workspace = Blockly.inject(workspaceRef.current, {
      toolbox: toolboxXml,
    });

    workspace.addChangeListener(() => {
      setAppSaved(false);
    });
  
    return () => {
      workspace.dispose();
    };
  }, []);

  const handleSaveApp = () => {
    const fileName = prompt("Enter a file name (including extension):", "app.iot");
    if (fileName !== null && fileName !== "") {
      const xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
      const xmlText = Blockly.Xml.domToText(xml);
      const blob = new Blob([xmlText], { type: 'text/xml' });
      saveAs(blob, fileName);
      setAppSaved(true);
  }

  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
  if (file) {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      // You can process the file content here
      console.log('Uploaded file content:', fileContent);
    };
    reader.readAsText(file);
  }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px", marginRight: "10px" }}>
      {/* Welcome Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Welcome to the Apps Editor</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
        <Button variant="primary" onClick={() => setShowModal(false)}>
            Start New App
          </Button>
          <input style={{ display: 'none' }} type="file" id="fileInput" onChange={handleFileUpload} />
          <label htmlFor="fileInput" style={{ marginLeft: "10px", marginTop: "10px", cursor: 'pointer', padding: '6px 12px', backgroundColor: 'lightgray', color: 'black', borderRadius: '4px', border: '1px solid black' }}>
            Choose File from This Computer
          </label>
        </Modal.Footer>
      </Modal>

      <AppManager show={showManager} onClose={() => setShowManager(false)} />

      {/* Blockly */}
      <div ref={workspaceRef} style={{ height: '84vh', width: '98vw' }} />
      <div>
        {/* Save app */}
        <Button onClick={handleSaveApp} disabled={appSaved}>
          Download App to This Computer
        </Button>
        {/* Input file */}
        <input style={{ display: 'none' }} type="file" id="fileInput" onChange={handleFileUpload} />
          <label htmlFor="fileInput" style={{ marginLeft: "10px", marginTop: "10px", cursor: 'pointer', padding: '6px 12px', backgroundColor: 'lightgray', color: 'black', borderRadius: '4px', border: '1px solid black' }}>
            Choose File from This Computer
        </label>
        {/* App Manager */}
        <Button variant="secondary" onClick={() => setShowManager(true)} style={{float:'right', marginTop: "10px"}}>App Manager</Button>
      </div>
    </div>
  );
}

export default Apps;
