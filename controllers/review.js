const Listing = require('../models/listing')
const review = require('../models/reviews')
const mongoose = require('mongoose')


module.exports.add = async (req,res)=>{
   // res.send('helo')
      const {id} = req.params;
      const data = req.body;
      const rev = new review({...data , owner : res.locals.islogin});
      console.log(rev);
      const result = await rev.save();  
      const r = await Listing.findByIdAndUpdate(id,{ $push: {reviews : result._id}});
             req.flash('success','review is added');

      res.redirect(`/api/listings/${id}`);
};

module.exports.delete = async (req,res)=>{
      
    const {id , reviewId} = req.params;
     
    await review.findByIdAndDelete(reviewId);
  
    await Listing.findByIdAndUpdate(id,{
            $pull: {reviews : reviewId}
      
    })
           req.flash('success','review is deleted');

    res.redirect(`/api/listings/${id}`);

}