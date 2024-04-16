// Apps.js
import React, { useRef, useEffect, useState } from 'react';
import Blockly from 'blockly';
import { Button } from 'react-bootstrap';
import { saveAs } from 'file-saver';

function Apps() {
  const workspaceRef = useRef(null);
  const [appSaved, setAppSaved] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

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
    <div>
      <div ref={workspaceRef} style={{ height: '480px', width: '600px' }} />
      <Button onClick={handleSaveApp} disabled={appSaved}>
        {appSaved ? 'App Saved' : 'Save App'}
      </Button>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}

export default Apps;
