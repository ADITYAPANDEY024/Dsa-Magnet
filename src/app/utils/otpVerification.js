const Twilio = require('twilio');
const ResponseService = require('./response.handler');
const { logger } = require('../utils/logger');

class OTPManager extends ResponseService {
    constructor(accountSid, authToken) {
        super();
        this.twilioClient = Twilio(accountSid, authToken);
    }

    sendOTP = async (phoneNumber, verifySid) => {
        try {
            const message = await this.twilioClient.verify.services(verifySid).verifications.create({
                to: `+91${phoneNumber}`,
                channel: 'sms',
            });
            logger.info(`OTP sent to ${phoneNumber}. Message SID: ${message.sid}`);
            return this.serviceResponse(200, { message }, `OTP sent to ${phoneNumber}.`);
        } catch (err) {
            logger.warn(err);
            console.error('Error sending OTP:', err);
            throw new Error('E: sendOTP() Failed to send otp ' + err.toString());
        }
    }

    verifyOTP = async (phoneNumber, verifySid, otp) => {
        try {
            const twilioResponse = await this.twilioClient.verify.services(verifySid).verificationChecks.create({
                to: `+91${phoneNumber}`,
                code: `${otp}`,
            });
            console.log('twilioResponse  :: ', twilioResponse);
            console.log(`OTP sent to ${phoneNumber}. Message SID: ${twilioResponse.sid}`);
            return this.serviceResponse(200, twilioResponse, `OTP sent to ${phoneNumber}.`);
        } catch (err) {
            console.log(err.message);
            throw new Error(err.message);
        }
    }
}

module.exports = new OTPManager();
