const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// global variables
let motionDetected = false;
let armed = false;
let canceled = true;
let RPiMotion = false;
let RPiButtons = false;

// functions to get value of varaibles
app.get('/canceled', (req, res) => {
    res.json({ message: canceled ? "1" : "0" });
});

app.get('/motionDetected', (req, res) => {
    res.json({ message: motionDetected ? "1" : "0" });
});

app.get('/armed', (req, res) => {
    res.json({ message: armed ? "1" : "0" });
});

app.get('/RPiMotion', (req, res) => {
    res.json({ message: RPiMotion ? "1" : "0" });
});

app.get('/RPiButtons', (req, res) => {
    res.json({ message: RPiButtons ? "1" : "0" });
});


// functions to change the value of variables
app.put('/update-RPiMotion', (req, res) => {
    const { RPiMotion: newRPi, services: s} = req.body;
    if (typeof newRPi !== 'boolean') {
        return res.status(400).send('Invalid request body');
    }
    RPiMotion = newRPi;
    if(!RPiMotion) {
        motionDetected = false;
        armed = false;
        cancelled = true;
    }
    console.log(`Motion Detector RPi ${RPiMotion ? 'Connected' : 'Disconnected'}`);
    if(RPiMotion) {
        console.log("Available Services: ", s);
    }
    res.send('System state updated successfully');
});

app.put('/update-RPiButtons', (req, res) => {
    const { RPiButtons: newRPi, services: s} = req.body;
    if (typeof newRPi !== 'boolean') {
        return res.status(400).send('Invalid request body');
    }
    RPiButtons = newRPi;
    if(!RPiButtons) {
        motionDetected = false;
        armed = false;
        cancelled = true;
    }
    console.log(`Alarm Interface RPi ${RPiButtons ? 'Connected' : 'Disconnected'}`);
    if(RPiButtons) {
        console.log("Available Services: ", s);
    }
    res.send('System state updated successfully');
});

app.put('/alertAuthorities', (req, res) => {
    if(!RPiMotion || !RPiButtons) {
        res.status(409).send('Devices are not yet connected');
    } else if(!armed) {
        res.status(409).send('Device is not armed');
    } else if(!motionDetected) {
        res.status(409).send('Motion was never detected');
    } else {
        console.log('Authorities have been called!');
        res.send('System state updated successfully');
    }
    motionDetected = false;
});

app.put('/update-armed', (req, res) => {
    const { a: newArmed } = req.body;

    if(!RPiMotion || !RPiButtons) {
        res.status(409).send('Devices are not yet connected');
    } else {
        if (typeof newArmed !== 'boolean') {
            return res.status(400).send('Invalid request body');
        }
        if(armed == newArmed) {
            res.send(`System already ${armed ? 'Armed' : 'Disarmed'}`);
        } else {
            armed = newArmed;
            if(!armed) {
                motionDetected = false;
                canceled = true;
            }
            console.log(`System ${armed ? 'Armed' : 'Disarmed'}`);
            res.send('System state updated successfully');
        }
    }
});

app.put('/update-canceled', (req, res) => {
    const { c: newCanceled } = req.body;

    if(!RPiMotion || !RPiButtons) {
        res.status(409).send('Devices are not yet connected');
    } else {
        if (typeof newCanceled !== 'boolean') {
            return res.status(400).send('Invalid request body');
        }
        if(!canceled && newCanceled) {
            canceled = true;
            res.send("alert cancelled")
        }
    }
});

app.put('/update-motionDetected', (req, res) => {
    const { md: newmotionDetected } = req.body;

    if(!RPiMotion || !RPiButtons) {
        res.status(409).send('Devices are not yet connected');
    } else if(!armed) {
        res.status(409).send('Device is not armed');
    } else {
        if (typeof newmotionDetected !== 'boolean') {
            return res.status(400).send('Invalid request body');
        }
        
        if(motionDetected == newmotionDetected) {
            return res.send(`System Alert already ${motionDetected ? 'Triggered' : 'Canceled'}`);
        } else {
            motionDetected = newmotionDetected;
            if(motionDetected) {
                canceled = false;
            }
            console.log(`System Alert ${motionDetected ? 'Triggered' : 'Canceled'}`);
            res.send('System state updated successfully');
        }
    }
});

app.put('/update-via-commandline', (req, res) => {
    const { a: newArmed } = req.body;

    if(!RPiMotion || !RPiButtons) {
        res.status(409).send('Devices are not yet connected');
    } else {
        if (typeof newArmed !== 'boolean') {
            return res.status(400).send('Invalid request body');
        }
        if(motionDetected && !newArmed) {
            return res.send('Cannot disarm when triggered.');
        }
        if(armed == newArmed) {
            res.send(`System already ${armed ? 'Armed' : 'Disarmed'}`);
        } else {
            armed = newArmed;
            if(!armed) {
                motionDetected = false;
                canceled = true;
            }
            console.log(`System ${armed ? 'Armed' : 'Disarmed'}`);
            res.send('System state updated successfully');
        }
    }
});

app.put('/cancel-via-commandline', (req, res) => {
    if(!RPiMotion || !RPiButtons) {
        res.status(409).send('Devices are not yet connected');
    } else if(motionDetected) {
        motionDetected = false;
        canceled = true;
        console.log('System Alert Canceled');
        res.send('Alert was cancelled');
    } else {
        res.send('Alert was never triggered');
    }
});

// run the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
