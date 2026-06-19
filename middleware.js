const Listing = require('./models/listing')
const review = require('./models/reviews');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirecturl = req.originalUrl;
        req.flash('error', 'You must be logged in');
        return res.redirect('/api/login');
    }
    next();
};

module.exports.saveredirect = (req,res,next)=>{
  if(req.session.redirecturl){
    res.locals.redirecturl = req.session.redirecturl;
  }
  else res.locals.redirecturl = '/api/listings';
  next()
}

module.exports.isOwner = async (req,res,next)=>{
    const {id} = req.params;
    const listing = await  Listing.findById(id);
    if(listing.owner.toString()!==res.locals.islogin._id.toString()){
      req.flash('error','you are not permite');
      return res.redirect(`/api/listings/${id}`);
    }
    next();
}

module.exports.reviewOwner = async (req,res,next)=>{
      
      const {id,reviewId} = req.params;
      const rev = await review.findById(reviewId);
    if(rev.owner.toString()!==res.locals.islogin._id.toString()){
      req.flash('error','you are not permite');
      return res.redirect(`/api/listings/${id}`);
    }
    next();
}

