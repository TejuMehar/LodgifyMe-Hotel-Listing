const express = require('express');
const router = express.Router({ mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js'); // Assuming you have a utility function for async error handling
const ExpressError = require('../utils/ExpressError.js'); // Assuming you have a custom error class for handling errors
const { listingSchema, reviewSchema } = require('../schema.js'); // Assuming you have a schema defined in schema.js
const  Review = require('../models/review.js'); // Assuming you have a Review model defined in models/review.js
const Listing = require('../models/listing'); // Assuming you have a Listing model defined in models/listing.js
const { isLoggedIn } = require('../middleware.js');
const reviewController = require('../controllers/reviewController.js');


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
router.post('/',isLoggedIn,validateReview,reviewController.postReview);

// Delete review Route 
router.delete('/:reviewId', wrapAsync(reviewController.deleteReview));


module.exports = router;
