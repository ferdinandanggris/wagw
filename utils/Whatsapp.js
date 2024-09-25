const { Client, LocalAuth } = require('whatsapp-web.js');
const path = require('path');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
class Whatsapp {
    constructor(clientId){
        this.qrCode = '';
        this.clientId = clientId;
        this.initializeClient();
    }

    initializeClient(){
        this.client = new Client({
            // authStrategy: new LocalAuth({
            //     clientId: this.clientId
            // }),
            puppeteer: {
                headless: true
            }
        });

        this.client.initialize();

        this.client.on('authenticated', (session) => {
            console.log(`session authenticated is ${session}`);
            console.log(`Client for user ${this.clientId} authenticated.`);
        });

        this.client.on('remote_session_saved', (session) => {
            console.log(`session saved is ${session}`);
            console.log(`Client for user ${this.clientId} session saved.`);
        });
    
        this.client.on('qr', (qr) => {
            console.log(`QR for user ${this.clientId} generated.`);
            console.log('QR code: ');
            qrcode.generate(qr, {small: true});
            // Simpan QR code untuk this.clientId dalam bentuk string
            this.qrCode = qr;
        });
    
        this.client.on('ready', () => {
            console.log(`Client for user ${this.clientId} is ready!`);
            this.qrCode = ''; // Hapus QR code setelah klien siap
        });
    
        this.client.on('disconnected',async (reason) => {
            await this.client.destroy();
            await this.getState();
            if (reason == 'NAVIGATION' || reason == 'LOGOUT') {
                this.removeSession();
            }
    
            console.log(`Client for user ${this.clientId} was logged out`, reason);
            this.qrCode = '' // Hapus QR code jika terputus
    
        });
    
        this.client.on('message', (msg) => {
            console.log(`Message from ${msg.from}: ${msg.body}`);
        });

        this.client.on('loading_screen', (status) => {
            console.log(`Loading screen status: ${status}`);
        });

        this.client.on('auth_failure', (msg) => {
            console.log(`Authentication failure: ${msg}`);
        });
    
    }

    sendMessage(number, message){
        const formattedNumber = `${number}@c.us`;
        this.client.sendMessage(formattedNumber, message);
    }

    getQrCode(){
        return this.qrCode;
    }

    destroy(){
        this.client.destroy();
        this.removeSession();
    }

    removeSession(){
        const folderPath = path.join(__dirname, `../.wwebjs_auth/session-${this.clientId}`);
        fs.rm(folderPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.log(`Error deleting folder: ${err.message}`);
            } else {
                console.log('Folder deleted successfully');
            }
        });
    }

    async getState(){
        return await this.client.getState();
    }
}

module.exports = Whatsapp;