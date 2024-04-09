const axios = require('axios');

// function to arm/disarm from endpoint
async function armDisarmSystem(armedValue) {
    try {
        const response = await axios.put('http://localhost:5000/update-via-commandline', { a: armedValue });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// function to cancel trigger from endpoint
async function cancelTrigger() {
    try {
        const response = await axios.put('http://localhost:5000/cancel-via-commandline');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// takes in user's command line arguments
const args = process.argv.slice(2);
if (args.length !== 1 || (args[0] !== 'arm' && args[0] !== 'disarm' && args[0] !== 'cancel')) {
    console.error('Usage: node system.js <arm/disarm/cancel>');
    process.exit(1);
}

// arms/disarms or cancels system based on user input
if(args[0] == 'cancel') {
    cancelTrigger();
} else {
    const armedValue = args[0] === 'arm' ? true : false;
    armDisarmSystem(armedValue);
}