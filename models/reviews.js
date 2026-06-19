const { required } = require('joi');
const mongoose = require('mongoose');
const User = require('./user');

const reviewSchema = mongoose.Schema({
    comment :{
        type: String,
        required:true,
    },
    rating : {
        type:Number,
        min : 1,
        max : 5,
        required:true,
    },
    owner :{
        type : mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    createAt :{
        type : Date,
        default:Date.now(), 
    }
})

const review = new mongoose.model('review',reviewSchema);        


module.exports = review;