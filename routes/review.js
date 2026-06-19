const mongoose = require('mongoose')
const express = require('express');
const route = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const review = require('../models/reviews.js');
const ExpressError = require('../utils/ExpressError.js')
const reviewsSchema = require('../schema.js')
const Listing = require('../models/listing.js');
const {isLoggedIn , reviewOwner} = require('../middleware.js');
const reviewcontroller = require('../controllers/review.js')


// validator for reviews

const validatereviws = (req,res,next)=>{
     const result = reviewsSchema.validate(req.body);
     if(result.error){
        throw new ExpressError(404,'field is missing');
     } else {
        next();
     }
}

// add reviews

route.post('/',isLoggedIn, wrapAsync(reviewcontroller.add))


// delete

route.delete('/:reviewId',isLoggedIn,reviewOwner, wrapAsync(reviewcontroller.delete))

module.exports = route;