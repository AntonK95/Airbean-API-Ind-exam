import Joi from "joi";

const offerSchema = Joi.object({
    products: Joi.array().items(Joi.string().required()).min(1).required(),
    offer: Joi.number().min(0).required()
});

export default offerSchema;