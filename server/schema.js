const Joi = require('joi');

const userSignupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().strip(),//reference: strip removes the field after .validate()
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    role: Joi.string().valid("resident", "provider").required(),
    category: Joi.string().valid('plumber', 'electrician', 'carpenter', 'painter', 'technician', 'other').when('role', {
        is: 'provider',
        then: Joi.required(),
        otherwise: Joi.optional()
    }),
    roomNo: Joi.string().when('role', {
        is: 'resident',
        then: Joi.required(),
        otherwise: Joi.optional()
    })
});

const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("resident", "provider").required()
});

const issueSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).required(),
    urgency: Joi.string().valid("low", "medium", "high").required(),
    category: Joi.string().valid('plumber', 'electrician', 'carpenter', 'painter', 'technician', 'other').required(),
    selectedOpt: Joi.string().valid('yes', 'no').required(),
    selectedProvider: Joi.string().when('selectedOpt', {
        is: "yes",
        then: Joi.string().length(24).hex().required(),
        otherwise: Joi.optional().allow("")
    })
})

module.exports = {userSignupSchema, userLoginSchema, issueSchema};