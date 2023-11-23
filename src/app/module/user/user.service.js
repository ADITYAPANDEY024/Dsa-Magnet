const express = require('express');
const logger = require('../../utils/logger')
const ResponseService = require('../../utils/response.handler');
const { BadRequestError, NotAuthorizedError, NotFoundError } = require('../../error/index')
const mongoose = require("mongoose");
const userModel = require('./user.model')
const bycrypt = require('bcrypt')
const { OAuth2Client } = require('google-auth-library')
const otpManager = require('../../utils/otpVerification');
const { preferences } = require('joi');
const axios = require('axios')
require('dotenv').config()
class userServices extends ResponseService {
    constructor() {
        super()
    }
    registerUserService = async (payload) => {
        try {
            console.log("createUserService:::");
            const { name, email, phoneNumber, password } = payload;
            console.log("email-password");
            const findUser = await userModel.findOne({
                $or: [
                    { email: email },
                    { phoneNumber: phoneNumber }
                ]
            });
            console.log("findUser:: ", findUser);
            if (findUser) {
                console.log("inside if of findUser:: ");
                return this.serviceResponse(400, {}, 'user already exists please signin')
            }
            //password encryption
            const hashPassword = await bycrypt.hash(password, 10)
            console.log("password==>", password, ", hashpassword==>", hashPassword);
            const user = await userModel.create({
                name,
                email,
                phoneNumber,
                password: hashPassword,
                isActive: false
            })
            // verification email using nodemailer
            console.log("IUSER", user);
            return this.serviceResponse(200, { user }, 'User created successfully')

            // else if (preference == 'mobile-number') {
            //     try {
            //         const { mobileNumber } = payload.mobileNumber;
            //         const findUser = await userModel.findOne({
            //             phoneNumber: phoneNumber
            //         });
            //         if (findUser) {
            //             throw new BadRequestError("User with the phone_number or email already exist")
            //         }
            //         const user = await userModel.create({ phoneNumber, isActive: true })
            //         return this.serviceResponse(200, { user }, 'User created successfully'); 1
            //     }
            //     catch (error) {

            //     }
            // }

        } catch (error) {
            console.log(error);
        }
    }
    signupViaSocialMedia = async (payload) => {
        try {
            const preference = payload.preference
            if (preference == "google") {
                try {
                    const client = new OAuth2Client(process.env.CLIENT_ID_GOOGLE)
                    const ticket = await client.verifyIdToken({ idToken: payload.token, audience: process.env.CLIENT_ID_GOOGLE })
                    const userprofile = ticket.getPayload()
                    const first_name = userprofile.given_name
                    const last_name = userprofile.family_name
                    const email = userprofile.email
                    const name = first_name + " " + last_name;
                    const user = await userModel.create({
                        name,
                        email,
                        isActive: true
                    })
                    return this.serviceResponse(200, { user }, 'User created successfully')
                } catch (err) {
                    return { code: 410, message: 'Invalid credentials or Token Expired' }
                }
            }

            else if (preference == 'linkdin') {
                console.log("im in linkdin")
                console.log(process.env.CLIENT_ID_LINKDIN);
                console.log(process.env.REDIRECT_URI_LINKDIN);
                const tokenResponse = await axios.get('http://www.linkdin.com/oauth/v2/authorization', {
                    response_type: 'code',
                    client_id: process.env.CLIENT_ID_LINKDIN,
                    redirect_uri: process.env.REDIRECT_URI_LINKDIN,
                    scope: 'r_liteprofile'
                })
                console.log(tokenResponse);
                // const token= await axios.post('https://www.linkedin.com/oauth/v2/accessToken',{
                //     grant_type:'authorization_code',
                //     code:
                // })

            }

            else if (preference == "github") {

            }

            else {

            }
        } catch (error) {
            console.log(error);
        }
    }
    signup = async (payload) => {

    }
    forgotpassword = async (payload) => {

    }
}
module.exports = new userServices()