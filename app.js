const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const Listing = require('./models/listing'); // Assuming you have a Listing model defined in models/listing.js
const mongoose = require('mongoose');
const cors = require('cors');   
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js'); // Assuming you have a utility function for async error handling
const ExpressError = require('./utils/ExpressError.js'); // Assuming you have a custom error class for handling errors
const { listingSchema, reviewSchema } = require('./schema.js'); // Assuming you have a schema defined in schema.js
const  Review = require('./models/review.js'); // Assuming you have a Review model defined in models/review.js
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter =require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");
require("dotenv").config();


const PORT = process.env.PORT || 3000;

// Set EJS as the template/view engine for rendering dynamic HTML
app.set('view engine', 'ejs');

// Set the directory where view (template) files are located
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming request bodies with URL-encoded payloads (from forms)
app.use(express.urlencoded({ extended: true }));

// Allow HTTP verbs like PUT and DELETE from forms using the '_method' query parameter
app.use(methodOverride('_method'));

app.engine('ejs',ejsMate);

const MONGO_URL = 'mongodb://localhost:27017/lodgifyMe';

 
async function main() {
   await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// app.get('/', (req, res) => {
//     res.send('Welcome to the API');
// });

const sessionOptions = {
  secret: "Tejas",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now()+7*24*60*60*1000,
    maxAge: 7+24*60*60*1000,
    httpOnly:true
  }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
  next();
})

// app.get('/demoUser', async(req,res)=>{
//   let fakeUser = new User ({
//     email: "tejasmehar7@gmail",
//     username: "delta-student"
//   });

//    let registerUser =  await User.register(fakeUser, "HellowWorld");
//    res.send(registerUser);

// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.use((req, res, next) => {
  // If no route matched, this middleware runs
  res.status(404).render('listings/Error.ejs', { status: 404, message: 'Page Not Found' });
});

// Error handler (for all other errors)
app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = err;
  res.status(status).render('listings/Error.ejs', { status, message });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
