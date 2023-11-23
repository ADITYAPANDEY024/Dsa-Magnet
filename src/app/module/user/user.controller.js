const express = require('express');
const logger = require('../../utils/logger')
const ResponseService = require('../../utils/response.handler');
const { BadRequestError, NotAuthorizedError, NotFoundError } = require('../../error/index')
const mongoose = require("mongoose");
const { createUserValidator, signupViaSocialMediaValidator } = require('./user.validator')
const userServices = require('./user.service')
const OtpManager = require('../../utils/otpVerification')
const userModel = require('./user.model')
class userController extends ResponseService {

    constructor() {
        super()
    }
    sendOtp = async (req, res, next) => {
        try {
            const phoneNumber = req.body.phoneNumber;
            const authtoken = process.env.TWILIO_AUTH_TOKEN;
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const verifySid = process.env.TWILIO_VERIFY_SID
            const otpManager = new OtpManager(accountSid, authToken);

            const findUser = await userModel.findOne({
                phoneNumber: phoneNumber
            });
            if (findUser) {
                throw new BadRequestError("User with the phone_number or email already exist")
            }

            const sendOTPVerification = await otpManager.sendOTP(phoneNumber, verifySid)
            sendOTPVerification.payload.to = phoneNumber
            delete sendOTPVerification.payload.message;

            if (sendOTPVerification.statusCode != 200) {
                return this.sendResponse(res, 400, sendOTPVerification.payload, 'OTP could not be send successfully')
            }
            return this.sendResponse(res, 200, sendOTPVerification, 'OTP sent successfully')
        } catch (error) {
            console.log('sendotp err:: ', err)
            next(err)
        }
    }
    verifyOtp = async (req, res, next) => {
        try {
            const phoneNumber = req.body.phoneNumber;
            const authtoken = process.env.TWILIO_AUTH_TOKEN;
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const verifySid = process.env.TWILIO_VERIFY_SID
            const otpManager = new OtpManager(accountSid, authToken);
            const otp = req.body.otp;
            const otpvalidation = await otpManager.verifyOTP(phoneNumber, verifySid, otp)

            if (!otpvalidation.payload.valid) {
                throw new NotAuthorizedError('OTP is invalid')
            }
            const customer = {
                mobileNumber: req.body.phoneNumber,
                preference: 'mobile-number'
            }
            const resp = await customerService.registerUserService(customer)
            const { statusCode, payload, message } = resp
            return this.sendResponse(res, 200, payload, 'OTP verified successfully')
        } catch (error) {
            next(err);
        }
    }
    createUserController = async (req, res, next) => {
        try {
            console.log(req.body);
            const { error, value } = createUserValidator.validate(req.body);
            if (error) {
                console.log("Bad error handler::");
                throw new BadRequestError(error.message);
            }
            const user = await userServices.registerUserService(value);
            console.log("user:::", user);
            const { statusCode, payload, message } = user

            return this.sendResponse(res, 200, payload, message)
        } catch (error) {
            console.log("error loda ", error);
            // next(error)
        }
    }

    signupViaSocialMediaController = async (req, res, next) => {
        try {
            const { error, value } = signupViaSocialMediaValidator.validate(req.body);
            if (error) {
                throw new BadRequestError(error.message);
            }
            console.log("in signupvalidator")
            const user = await userServices.signupViaSocialMedia(value);
            const { statusCode, payload, message } = user

            return this.sendResponse(res, 200, payload, message)
        } catch (error) {

        }
    }
}

module.exports = new userController(); 