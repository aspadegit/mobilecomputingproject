import net from 'net';
import dgram from 'dgram';
import express from "express";

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

var tweet = `{ \"Tweet Type\" : \"Service call\",
\"Thing ID\" : \"AlarmInterface\",
\"Space ID\" : \"AlarmSmartSpace\",
\"Service Name\" : \"no service\",
\"Service Inputs\" : \"()\"
}`;

server.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
});

//receives messages from the client
server.on('message', (message, remote) => {
    console.log("SERVER RECEIVED:");
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
//var client = dgram.createSocket('udp4');
var piIP = "10.20.155.30";

var client = new net.Socket();
client.setEncoding('utf-8');

//setInterval(clientWrite, 5000);

function clientWrite()
{
    client.connect(6668, piIP, function() {
        
        client.write(tweet);

    });
}
//receiving the reply tweet from the Pi
client.on('data', (data) =>{
    var json = JSON.parse(data);
    console.log("CLIENT RECEIVED:")
    console.log("Result: " + json["Service Result"]);
});