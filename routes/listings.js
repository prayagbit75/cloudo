const mongoose = require('mongoose')
const express = require('express');
const route = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js')
const {saveredirect,isLoggedIn,isOwner} = require('../middleware.js');
const listingcontroller = require('../controllers/listings.js');
const multer  = require('multer')
const {storage} = require('../cloudconfig.js');
const upload = multer({ storage }) 


// all listings

route.get('/', wrapAsync(listingcontroller.index));


// add new listings

route.get('/new',  isLoggedIn ,listingcontroller.new);


route.post('/add' , upload.single('image') ,wrapAsync(listingcontroller.add));

// show specific listings

route.get('/:id', wrapAsync(listingcontroller.show));


// edit

route.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingcontroller.edit))

route.patch('/:id/update' ,isOwner,upload.single('image'),wrapAsync(listingcontroller.update));

// delete        

route.delete('/:id/Delete',isLoggedIn,isOwner,wrapAsync(listingcontroller.delete))

module.exports = route;