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
const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js')
const session =require('express-session');
const flash = require('connect-flash');
const { read } = require('fs');


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



app.use(session({
  secret: "Tejas Mehar",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly: true
  }
}));

app.use(flash());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})


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





const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    // If validation fails, render the error page with the validation message
    throw new ExpressError(400, error.details[0].message);
  }
  next(); 
}


app.use('/listings',listings);
app.use('/listings/:id/reviews', reviews);



// app.all('*', (req, res, next) => {
//   next(new ExpressError(404, 'Page Not Found'));
// });

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
