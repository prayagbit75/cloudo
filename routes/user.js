const mongoose = require('mongoose');
const express = require('express');
const route = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const User = require('../models/user'); 
const passport = require('passport');
const {saveredirect} = require('../middleware');
const user = require('../controllers/user');


route.route('/signup')
.get(user.getsignup)
.post( wrapAsync(user.postsignup))


route.route('/login')
.get(user.getlogin)
.post(saveredirect ,passport.authenticate('local', { failureRedirect: '/api/login', failureFlash : true }) , user.postlogin)


route.get('/logout',user.logout)


module.exports = route;