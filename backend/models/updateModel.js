import Joi from 'joi'

const updateUserSchema = Joi.object({
    userId: Joi.string().required(),
    username: Joi.string().min(5).max(10).alphanum().allow(null, '').optional(),
    password: Joi.string().min(8).allow(null, '').optional(),
    email: Joi.string().email().allow(null, '').optional()
})

export default updateUserSchema;