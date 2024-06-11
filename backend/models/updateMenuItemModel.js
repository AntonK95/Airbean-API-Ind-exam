import Joi from "joi";

const updateMenuItemSchema = Joi.object({
    // productId: Joi.string().required(),
    id: Joi.number().required(),
    title: Joi.string().allow(null, '').optional(),
    desc: Joi.string().allow(null, '').optional(),
    price: Joi.number().optional(),
});

export default updateMenuItemSchema;