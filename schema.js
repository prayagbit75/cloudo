const   joi = require('joi');
const mongoose = require('mongoose')

const listingschema = joi.object({
    title : joi.string().required(),
    Discription : joi.string().required(),
    image : joi.string().required(),
    price : joi.string().required().min(0),
    location : joi.string().required(),
    Country: joi.string().required(),
})

module.exports = listingschema;

const reviewsSchema = joi.object({
      comment : joi.string().required(),
    rating : joi.number().required().min(1).max(5),
    createAt : joi.date(),  
})

module.exports = reviewsSchema;