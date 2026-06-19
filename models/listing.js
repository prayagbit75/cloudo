const mongoose = require('mongoose');

const Schema =  mongoose.Schema;
// const User = require('./user');
const ListingSchema = new Schema({
    title:{
        type : String,
        required:true,
    },
    Discription :{
        type : String,
        required : true
    },
    image :{

        url:String,
        filename : String
        // type : String,
        // required : true,
        // default : '123444444444444'
        // set : (v)=> v === "" ? "image.nature" : v -> this set the value of image if it not come from the client or if come then it also set the value of image 
    },
    price :{
        type : Number,
        required : true,
    },
    location :{
        type : String,
        required : true,
    },
    Country:{
        type : String,
        required : true,
    },
    reviews :[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'review',
        }
    ]
    ,
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
 geometry: {
    type: {
        type: String,
        enum: ["Point"],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
}   
})


ListingSchema.post('findOneAndDelete', async (listing) => {
    
    if (listing && listing.reviews.length > 0) {
        
        await review.deleteMany({
            _id: { $in: listing.reviews }
        });
        
        console.log("Associated reviews deleted");
    }
});


const Listing = new mongoose.model('Listings',ListingSchema)

module.exports = Listing;