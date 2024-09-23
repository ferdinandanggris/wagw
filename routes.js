const express = require('express');
const router = express.Router();
const WhatsappService = require('./services/WhatsappService');

// Endpoint untuk inisialisasi client baru
router.post('/create-session', (req, res) => {
    const {userId} = req.body;
    let result = WhatsappService.createClient(userId);
    res.status(result.status_code).json(result);
});

// Endpoint untuk mendapatkan QR code dalam bentuk string
router.get('/get-qr/:userId',async (req, res) => {
    const userId = req.params.userId;
    let result =await WhatsappService.getQrCode(userId);
    res.status(result.status_code).json(result);
});

// Endpoint untuk mengirim pesan
router.post('/send-message/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { number, message } = req.body;

   let result =await WhatsappService.sendMessage(userId, number, message);
    res.status(result.status_code).json(result);
});

// Endpoint untuk mengecek status koneksi berdasarkan user ID
router.get('/status/:userId', (req, res) => {
    const userId = req.params.userId;
    if (clients[userId] && clients[userId].info && clients[userId].info.wid) {
        res.status(200).json({ status: 'connected' });
    } else {
        res.status(500).json({ status: 'not connected' });
    }
});

router.post('/logout/:userId', async (req, res) => {
    const userId = req.params.userId;
    let result = WhatsappService.logout(userId);
    res.status(result.status_code).json(result);
});

module.exports = router;

