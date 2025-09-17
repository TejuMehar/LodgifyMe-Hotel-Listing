const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/database.js'); 
const Listing = require('./models/listing'); 
const mongoose = require('mongoose');
const cors = require('cors');   
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js'); 
const ExpressError = require('./utils/ExpressError.js'); 
const { listingSchema, reviewSchema } = require('./schema.js'); 
const  Review = require('./models/review.js'); 
const { connect } = require('http2');
const listingRoute =  require("./routes/listing.js");




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




connectDB();


const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }else{
  next();
  } 
}


app.use("/listings",listingRoute);

//Reviews Routes
//post new review
app.post('/listings/:id/reviews', async (req, res) => {

    const { id } = req.params;
   let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
});

// Delete review Route 
app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));


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
