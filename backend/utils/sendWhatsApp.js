const twilio = require('twilio');
require('dotenv').config();

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsApp = async (to, message) => {
    try {
        const response = await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`,
            body: message
        });
        console.log(`WhatsApp message sent to ${to}`);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
};

module.exports = sendWhatsApp;
