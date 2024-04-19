// Apps.js
import React, { useRef, useEffect, useState } from 'react';
import Blockly from 'blockly';
import { Button } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { Modal } from 'react-bootstrap'
import AppManager from '../AppManager';

function Apps({apps, setApps, relationships}) {
  const workspaceRef = useRef(null);
  const [appSaved, setAppSaved] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [showManager, setShowManager] = useState(false);
  const [toolboxXml, setToolboxXml] = useState(`
  <xml id="toolbox" style="display: none;">
    <category name="Sequential" colour="#5CA65C">
      <block type="controls_repeat_ext"></block>
      <block type="controls_whileUntil"></block>
    </category>
    <category name="Order-Based" colour="#5C68A6">
      <block type="math_number"></block>
      <block type="math_arithmetic"></block>
    </category>
    <category name="Conditional" colour="#5CA68D">
      <block type="text"></block>
      <block type="text_length"></block>
    </category>
  </xml>
  `);

  useEffect(() => { 
    console.log("relationships", relationships)
  
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
    const fileName = prompt("Enter a file name (including .iot extension):");
    if (fileName !== null && fileName !== "" && fileName.trim().endsWith('.iot')) {
      const xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
      const xmlText = Blockly.Xml.domToText(xml);
      const blob = new Blob([xmlText], { type: 'text/xml' });
      saveAs(blob, fileName);
      setAppSaved(true);
      console.log('Saved file content:', xmlText);
    } else if (fileName) {
      alert("The file name must end with '.iot'");
  }
  };

  const handleFileUpload = (fileContent) => {
    // Parse the file content and set it to the Blockly workspace
    console.log('Uploaded file content:', fileContent);
    // Check if the textToDom function exists in the Xml namespace
    try{
      let xmlDom = Blockly.utils.xml.textToDom(fileContent);
      Blockly.Xml.domToWorkspace(xmlDom, Blockly.getMainWorkspace());
      // Force Blockly to update the toolbox and redraw the workspace
      Blockly.getMainWorkspace().updateToolbox(toolboxXml);
    } catch (e) {
      console.error("invalid xml");
    }
    setShowManager(false);
  };

  const handleFileUploadFromComputer = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        // You can process the file content here
        console.log('Uploaded file content:', fileContent);
        try{
          let xmlDom = Blockly.utils.xml.textToDom(fileContent);
          Blockly.getMainWorkspace().clear();
          Blockly.Xml.domToWorkspace(xmlDom, Blockly.getMainWorkspace());
          // Force Blockly to update the toolbox and redraw the workspace
          Blockly.getMainWorkspace().updateToolbox(toolboxXml);
        } catch (e) {
          console.error("invalid xml");
        }
      };
      setShowModal(false);
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
          <input style={{ display: 'none' }} type="file" id="fileInputFromComputer" onChange={handleFileUploadFromComputer} />
          <label htmlFor="fileInputFromComputer" style={{ marginLeft: "10px", marginTop: "10px", cursor: 'pointer', padding: '6px 12px', backgroundColor: 'lightgray', color: 'black', borderRadius: '4px', border: '1px solid black' }}>
            Choose File from This Computer
          </label>
        </Modal.Footer>
      </Modal>

      <AppManager apps={apps} setApps={setApps} show={showManager} onClose={() => setShowManager(false)} onFileUpload={handleFileUpload}/>

      {/* Blockly */}
      <div ref={workspaceRef} style={{ height: '84vh', width: '98vw' }} />
      <div>
        {/* Save app */}
        <Button onClick={handleSaveApp} disabled={appSaved}>
          Download App to This Computer
        </Button>
        {/* Input file */}
        <input style={{ display: 'none' }} type="file" id="fileInputFromComputer" onChange={handleFileUploadFromComputer} />
          <label htmlFor="fileInputFromComputer" style={{ marginLeft: "10px", marginTop: "10px", cursor: 'pointer', padding: '6px 12px', backgroundColor: 'lightgray', color: 'black', borderRadius: '4px', border: '1px solid black' }}>
            Choose File from This Computer
        </label>
        {/* App Manager */}
        <Button variant="secondary" onClick={() => setShowManager(true)} style={{float:'right', marginTop: "10px"}}>App Manager</Button>
      </div>
    </div>
  );
}

export default Apps;
