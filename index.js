const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const app = express();
const port = 3000;

// Mulai server Express
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use(express.json());
app.use('/api', require('./routes'));

process.on('unhandledRejection', (reason, promise) => {
    // jika reason adalah protocol error karena chrome di close secara manual, maka kemungkinan user melakukan logout
    if (reason.message.includes('Protocol error')) {
        console.log('User might have logged out.');
    }else if(reason.message.includes('browser has disconnected')) {
        console.log('User might have logged out.');
    }else if(reason.message.includes("(reading 'WidFactory')")) {
        console.log('Terjadi kesalahan pada whatsapp, silakan login ulang');
    }else{
            console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    }

});