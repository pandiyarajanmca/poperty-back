const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;;

const client = new twilio(accountSid, authToken);

const sendMessage = (body, to) => {
  return client.messages.create({
    body,
    to,  // Text this number
    from: twilioNumber
  });
}

module.exports = {
  sendMessage
}