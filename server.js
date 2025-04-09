require('dotenv').config(); // Carga las variables del .env
const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Configura Twilio con variables de entorno
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Simula respuesta de DeepSeek (puedes personalizarla)
async function getDeepSeekResponse(message) {
    return `🤖 Respuesta a: "${message}"\n\nEscribe otra cosa!`;
}

// Webhook para WhatsApp
app.post('/whatsapp', async (req, res) => {
    try {
        const userMessage = req.body.Body;
        const sender = req.body.From;

        if (!userMessage || !sender) {
            throw new Error('Datos incompletos de Twilio');
        }

        const aiResponse = await getDeepSeekResponse(userMessage);

        await client.messages.create({
            body: aiResponse,
            from: 'whatsapp:+14155238886', // Número Sandbox
            to: sender
        });

        res.status(200).send('OK');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error interno');
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Bot activo ✅');
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bot escuchando en http://localhost:${PORT}`);
});