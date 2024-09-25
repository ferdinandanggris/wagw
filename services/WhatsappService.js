const Whatsapp = require("../utils/Whatsapp");
class WhatsappService {
    Client = {};

    createClient(clientId) {
        try {
            if (this.Client[clientId]) {
                return {
                    status: false,
                    status_code: 409,
                    message: 'Client already exists for user ' + clientId
                }
            }

            let client = new Whatsapp(clientId);
            this.Client[clientId] = client;
            return {
                status: true,
                status_code: 200,
                message: 'Client created successfully for user ' + clientId
            }
        } catch (error) {
            return {
                status: false,
                status_code: 500,
                message: error.message
            }
        }
    }

    async getQrCode(clientId) {
        try {
        if (this.Client[clientId]) {

            if (this.Client[clientId].getState() === 'CONNECTED') {
                return {
                    status: false,
                    status_code: 400,
                    message: "Klien sudah terhubung untuk pengguna " + clientId,
                    data : {
                        qr_code: ''
                    }
                }
            }

            if (this.Client[clientId].getQrCode()) {
                return {
                    status: true,
                    status_code: 200,
                    message : 'QR code generated successfully for user ' + clientId,
                    data : {
                        qr_code: this.Client[clientId].getQrCode()
                    }
                }
            }else{
                return {
                    status: false,
                    status_code: 404,
                    message: 'QR code not ready for user ' + clientId + ' or user has already logged in',
                    data : {
                        qr_code: ''
                    }
                }
            }

        } else {
            return {
                status: false,
                status_code: 404,
                message: 'Client not found for user ' + clientId,
                data : {
                    qr_code: ''
                }
            }
        }
        } catch (error) {
            return {
                status: false,
                status_code: 500,
                message: error.message,
                data : {
                    qr_code: ''
                }
            }
            
        }

    }

    async sendMessage(clientId, number, message) {
        try {
            if (this.Client[clientId]) {
                let state = await this.Client[clientId].getState();
                console.log(state);
                if (state !== 'CONNECTED') {
                    return {
                        status: false,
                        status_code: 400,
                        message: 'Client is not connected for user ' + clientId
                    }
                }

                this.Client[clientId].sendMessage(number, message);
                return {
                    status: true,
                    status_code: 200,
                    message: 'Message sent successfully to ' + number
                }
            } else {
                return {
                    status: false,
                    status_code: 404,
                    message: 'Client not found for user ' + clientId
                }
            }
        } catch (error) {
            return {
                status: false,
                status_code: 500,
                message: error.message
            }
        }
    }

    logout(clientId) {
        try {
            if (this.Client[clientId]) {
                this.Client[clientId].destroy();
                delete this.Client[clientId];
                return {
                    status: true,
                    status_code: 200,
                    message: 'Client logged out successfully for user ' + clientId
                }
            } else {
                return {
                    status: false,
                    status_code: 404,
                    message: 'Client not found for user ' + clientId
                }
            }
        } catch (error) {
            return {
                status: false,
                status_code: 500,   
                message: error.message
            }
        }
    }

    getStatus(clientId) {
        try {
            if (this.Client[clientId]) {
                let state = this.Client[clientId].getState();
                if(state === 'CONNECTED'){
                    return state;
                }
                return 'NOT_CONNECTED'; 
            } else {
                return {
                    status: false,
                    status_code: 404,
                    message: 'Client not found for user ' + clientId
                }
            }
        } catch (error) {
            return {
                status: false,
                status_code: 500,
                message: error.message
            }
        }
    }
}

module.exports = new WhatsappService();