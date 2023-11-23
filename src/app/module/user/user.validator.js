const Joi = require('joi');

const createUserValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string(),
    phoneNumber: Joi.string().min(10).max(10),
    profilePic: Joi.string(),
    isActive: Joi.boolean().default(false),
    preference: Joi.string().required()
})
const signupViaSocialMediaValidator = Joi.object({
    preference: Joi.string().required()
})

module.exports = { createUserValidator, signupViaSocialMediaValidator };
