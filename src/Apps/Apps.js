// Apps.js
import React, { useRef, useEffect, useState } from 'react';
import Blockly from 'blockly';
import { Button } from 'react-bootstrap';

function Apps() {
  const workspaceRef = useRef(null);
  const [appSaved, setAppSaved] = useState(false);

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
    // Logic to save the app
    setAppSaved(true);
  };

  return (
    <div>
      <div ref={workspaceRef} style={{ height: '480px', width: '600px' }} />
      <Button onClick={handleSaveApp} disabled={appSaved}>
        {appSaved ? 'App Saved' : 'Save App'}
      </Button>
    </div>
  );
}

export default Apps;
