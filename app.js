const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const app = express();

if(process.env.NODE_ENV!='production'){
require('dotenv').config()
}





app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate)
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");


const flash = require('connect-flash');
app.use(flash());



const port = 8080;
const mongoose_url = process.env.ATLASDB_URL;


main()
.then(() => {
    console.log("database is connected!");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(mongoose_url);
}

app.get("/", (req, res) => {
     res.redirect('/api/listings')
});


const session = require('express-session');
const {MongoStore} = require('connect-mongo');
 const  {createWebCryptoAdapter }= require('connect-mongo');

const store = MongoStore.create({
    mongoUrl :mongoose_url,
     touchAfter: 24 * 3600,
       cryptoAdapter: createWebCryptoAdapter({
    secret:  process.env.SECRET,
  }),
    
})

store.on('error',()=>{
    console.log('store error' , error);
})

const options ={
    store,
     secret:   process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires : Date.now() + 3*24*60*60*1000,
    maxAge : 3*24*60*60*1000,
    httpOnly:true
  }
}
app.use(session(options));

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.session());
app.use(passport.initialize());


// validate listing middleware   


// const validatelisting = (req,res,next)=>{
//  const result =  listingschema.validate(req.body);
//          if(result.error){
//             throw new ExpressError(400,'field is missing !');
//          }
//          else {
//             next();
//          }
// }





app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.islogin = req.user;

    next();
})

const listings = require('./routes/listings.js');
const review = require('./routes/review.js')
const signup = require('./routes/user.js');
const { error } = require('console');


app.use('/api',signup);
app.use('/api/listings',listings);
app.use('/api/listings/:id/reviews',review);



// app.get('/demo',async (req,res)=>{
//     let fake = new User({
//         email:'e@gmail.com',
//         username:'e',
//     })
//     let registerU = await User.register(fake,'e@123');
//     res.send(registerU);
// })



app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "client side error"));
});


app.use((error,req,res,next)=>{
    const {status=500 , message='something went wrong'} = error;
     res.status(status).render('err.ejs',{message});
})


app.listen(port, () => {
    console.log("app is listening on port no:", port);  
});


 




