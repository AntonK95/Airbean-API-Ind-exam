import Joi  from 'joi'

const userSchema = Joi.object({
    username: Joi.string().min(3).max(15).alphanum().required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
    role: Joi.string().required()
})

export default userSchema;