import net from 'net';
import dgram from 'dgram';
import express from "express";
import cors from 'cors';

var server = dgram.createSocket("udp4");

const MCAST_ADDR = "232.1.1.1";
const MCAST_PORT = 1235;

var thingList = []; //an array of JSON thing objects
var serviceList = [];   //an array of JSON service objects

const app = express();
const port = 3001;

app.get('/getThings', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.send(JSON.stringify(thingList));
});

app.get('/getServices', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.send(JSON.stringify(serviceList));
  });


  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*thing structure:
{
    ip: {piIP},
    thingID: {thingID}
}

*/

/*service structure:
{
    ip: {piIP},
    thingID: {thingID},
    entityID: {entityID},
    serviceName: {serviceName},
    serviceInput: {serviceInput}, // in format [name, type, NULL, name2, type2, NULL]
    serviceOutput: {serviceOutput} //just the type (as a string)
}
*/


server.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
});

//receives messages from the client
server.on('message', (message, remote) => {
    //console.log('MCast Msg: From: ' + remote.address + ':' + remote.port +' - ' + message);
    let stringMessage = message.toString();

    var nestedInputStringsMatch = /\[".*".*(".*")*]/g.exec(stringMessage);
    if(nestedInputStringsMatch)
    {
        //replace the nested quotes with nothing
        var temp = nestedInputStringsMatch[0].replace(/"/g, '');
        //replace the original part of the string
        stringMessage = stringMessage.replace(/\[".*".*(".*")*]/g, temp);
    }

    var json = JSON.parse(stringMessage);
    parseTweetType(json, remote.address);
    
});

server.bind(MCAST_PORT, () => {
    
    server.setBroadcast(false);
    server.setMulticastTTL(128);
    server.addMembership(MCAST_ADDR);
    console.log("listening: " + server.address().address);
    
});

function parseTweetType(json, ip)
{
    switch(json["Tweet Type"])
    {
        case "Identity_Thing":
            addToThingList(json, ip);
            break;
        case "Service":
            addToServiceList(json, ip);
            break;
    }
}

function addToThingList(json, ip)
{
    console.log("SERVER RECEIVED:");

    if(json === undefined)
        return false;

    for(let i = 0; i < thingList.length; i++)
    {
        //already exists in the list, return false
        if(thingList[i].thingID == json["Thing ID"])
            return false;
    }

    //not in the list, add it
    var thing = {"ip": ip, "thingID": json["Thing ID"]};
    console.log("thing:" + JSON.stringify(thing));
    thingList.push(thing);
}

function addToServiceList(json, ip)
{
    console.log("SERVER RECEIVED:");

    if(json === undefined)
    return false;

    for(let i = 0; i < serviceList.length; i++)
    {
        //already exists in the list, return false
        if(serviceList[i].thingID == json["Thing ID"] && serviceList[i].serviceName == json["Name"] && serviceList[i].entityID == json["Entity ID"])
            return false;
    }

    //split results in [serviceName, [inputs], output]
    var inputOutput = json["API"].split(":");
    
    //makes a string "[1,2,3]" into an array [1,2,3] (removes [ and ] from the string and then splits based on the comma)
    var inputs = inputOutput[1].replace(/\[|\]/g,'').split(',');

    //makes a string "(1,2,3)" into an array [1,2,3] (removes ( and ) from the string and then splits based on the comma)
    var outputs = inputOutput[2].replace(/\(|\)/g,'').split(',');
    var outputType = (outputs.length > 1)? outputs[1] : outputs[0];

    var service = {"ip": ip, "thingID": json["Thing ID"], "entityID" : json["Entity ID"], "serviceName": json["Name"], "serviceInput": inputs, "serviceOutput": outputType};
    console.log("service: " + JSON.stringify(service));
    serviceList.push(service);

}


// ========================= CLIENT CODE ======================
const HOST_ADDR = "10.20.155.26";
var piIP = "";

var client = new net.Socket();
client.setEncoding('utf-8');

//prevents CORS errors on client side
app.use(cors());
app.use(express.json());

//handle running a service, which will then require this to be a client
app.post('/runService', (req, res) => {

 
    console.log("POST REQUEST: ");
    console.log(req.body);
    
    piIP = req.body.ip;

    var tweet = `{ \"Tweet Type\" : \"Service call\",
    \"Thing ID\" : \"${req.body.thingID}\",
    \"Space ID\" : \"AlarmSmartSpace\",
    \"Service Name\" : \"${req.body.serviceName}\",
    \"Service Inputs\" : \"(${req.body.params})\"
    }`;

    client = new net.Socket();
    client.setEncoding('utf-8');
    client.connect(6668, piIP, () => { });
    
    client.write(tweet);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.send("PUT Request Called")
})



//receiving the reply tweet from the Pi
client.on('data', (data) =>{
    var json = JSON.parse(data);
    console.log("CLIENT RECEIVED:")
    console.log("Result: " + json["Service Result"]);
    
});

client.on('error', (error) => {
    console.log(error);
});
