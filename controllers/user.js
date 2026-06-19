const User = require('../models/user'); 
const passport = require('passport');
const mongoose = require('mongoose');

module.exports.getsignup = (req,res)=>{
    res.render('user/signup.ejs');
}

module.exports.postsignup = async (req,res,next)=>{
    try{
    const {email,username,password} = req.body;
    const user = new User({email,username});
    const result = await User.register(user,password);
    console.log(result);    
    req.login(result,(err)=>{
        if(err){
           return next(err);
        }
     req.flash('success','welcome to CloudO')
    res.redirect('/api/listings');
    })
   
    } catch(err){
        req.flash('success','user already exist');
        res.redirect('/api/signup');
    }

}

module.exports.getlogin = (req,res)=>{
    res.render('user/login.ejs');
}

module.exports.postlogin = async (req,res)=>{
    req.flash('success','you are logined!');
    res.redirect(res.locals.redirecturl);
}

module.exports.logout = (req,res,next)=>{
     req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash('success','you are logged out');
        res.redirect('/api/listings');
     })
};