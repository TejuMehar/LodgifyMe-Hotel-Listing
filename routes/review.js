const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js'); // Assuming you have a utility function for async error handling
const ExpressError = require('../utils/ExpressError.js'); // Assuming you have a custom error class for handling errors
const { listingSchema, reviewSchema } = require('../schema.js'); // Assuming you have a schema defined in schema.js
const  Review = require('../models/review.js'); // Assuming you have a Review model defined in models/review.js
const Listing = require('../models/listing'); // Assuming you have a Listing model defined in models/listing.js




const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    // If validation fails, render the error page with the validation message
    throw new ExpressError(400, error.details[0].message);
  }
  next(); 
}

//Reviews Routes
//post new review
router.post('/listings/:id/reviews', async (req, res) => {

    const { id } = req.params;
   let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
     req.flash("success","New Review Created !");
    res.redirect(`/listings/${id}`);
});

// Delete review Route 
router.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));


module.exports = router;
