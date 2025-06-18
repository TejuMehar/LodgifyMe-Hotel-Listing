const joi = require('joi');

module.exports.listingSchema = joi.object({

    listing : joi.object({
    title: joi.string().required(),
    description: joi.string().required(), 
    image: joi.string().uri().allow("",null),
    location: joi.string().required(),
    country: joi.string().required(),
    price: joi.number().min(0).required().min(1000).max(1000000),
    availableFrom: joi.date().iso().required(),
    availableTo: joi.date().iso().greater(joi.ref('availableFrom')).required()
    }).required()
});
