const mongoose = require('mongoose')
const Listing = require('../models/listing');
const axios = require("axios");

module.exports.index = async (req, res) => {
    const lists = await Listing.find({});
    res.render('listings/index.ejs', { lists });
}  

module.exports.new =  (req,res) => {
    res.render('listings/new.ejs'); 
};

module.exports.add = async (req, res , next) => {
   const url = req.file.path;   
   const filename = req.file.filenamee; 

   
   const data = req.body
   const geourl = `https://api.geoapify.com/v1/geocode/search?text=${data.location}&apiKey=${process.env.GEOAPIFY_API_KEY}`
       const response = await axios.get(geourl);

          const  list = await new Listing({...data,owner:res.locals.islogin._id,image :{
            url,filename
          },geometry:response.data.features[0].geometry});
       await list.save();
       req.flash('success','listing is added');
       res.redirect('/api/listings');
     
}

module.exports.show = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid Listing ID");
    }

    const list = await Listing.findById(id).populate({path : 'reviews',populate:{ path : 'owner'}}).populate('owner');

    if (!list) {
        req.flash('error','listing does not exist !')
        return res.redirect('/api/listings');
    }
    res.render('listings/show.ejs', { list });
}

module.exports.edit = async (req,res)=>{
     
     const {id} = req.params;
     const list = await Listing.findById(id);
     const orignalurl = list.image.url;
     orignalurl.replace('upload','upload/w_250')
         if (!list) {
        req.flash('error','listing does not exist !')
        return res.redirect('/api/listings');
    }
      res.render('listings/edit.ejs',{list,orignalurl});
}

module.exports.update = async (req,res)=>{
     const {id} = req.params;
     const data = req.body;


     
     const listing = await Listing.findById(id);
     if(listing.owner.toString()!==res.locals.islogin._id.toString()){
        req.flash('error','You can not edit this post');
        return res.redirect(`/api/listings/${id}`);
     };


    const list =  await Listing.findByIdAndUpdate(id,data);
     console.log(list)
    
    if(typeof req.file !=='undefined'){
        console.log('kon aya!')
        const url = req.file.path;
        const  filename = req.file.filename;
        list.image = {url,filename};
        await list.save();
    }
    
    req.flash('success','listing is updated');
    if (!list) {
        req.flash('error','listing does not exist !')
        return res.redirect('/api/listings');
    }
     res.redirect("/api/listings");
}

module.exports.delete = async (req,res)=>{
    const {id} = req.params;
         const listing = await Listing.findById(id);
   
      await Listing.findByIdAndDelete(id); 
             req.flash('success','listing is deleted');
    if (!list) {
        req.flash('error','listing does not exist !')
        return res.redirect('/api/listings');
    }
     res.redirect("/api/listings");
}