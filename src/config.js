require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const roomName = process.env.TWILIO_ROOM_NAME || 'TheSite:TestRoom';

module.exports = { accountSid, authToken, apiKey, apiSecret, roomName };