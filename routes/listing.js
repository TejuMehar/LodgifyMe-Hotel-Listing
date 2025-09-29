const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js'); // Assuming you have a utility function for async error handling
const ExpressError = require('../utils/ExpressError.js'); // Assuming you have a custom error class for handling errors
const { listingSchema, reviewSchema } = require('../schema.js'); // Assuming you have a schema defined in schema.js
const Listing = require('../models/listing'); // Assuming you have a Listing model defined in models/listing.js
const mongoose = require('mongoose');
const { isLoggedIn,isOwner } = require('../middleware.js');
const listingController = require('../controllers/listingController');
const multer  = require('multer');
const { storage } = require('../cloudConfig.js'); // Assuming you have a cloudinary configuration file
const upload= multer({storage}); // Configure multer to save files to 'uploads/' directory


const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details[0].message;
    // If the error message contains 'availableTo', replace it with 'Available To'  
    // If validation fails, render the error page with the validation message
   throw new ExpressError(400, error.details[0].message);
  }
  next();
}

//Router Routes
router.route('/').get(wrapAsync(listingController.index))
.post(upload.single("listing[image]"),(req,res)=>{
  res.send(req.file);
});
// .post(validateListing,isLoggedIn,wrapAsync(listingController.createListing));




 //Index Route
// router.get('/', wrapAsync(listingController.index));

//new Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(validateListing,isLoggedIn,isOwner,listingController.updateListing)

//Show Route
// router.get('/:id', wrapAsync(listingController.showListing));

//Create Route
// router.post("/", validateListing,isLoggedIn,wrapAsync(listingController.createListing));

// Edit Route
router.get("/:id/edit",isLoggedIn,listingController.editListing);


//Update Route
// router.put("/:id", validateListing,isLoggedIn,isOwner,listingController.updateListing);


//Delete Route
router.delete("/:id/delete",isLoggedIn,listingController.deleteListing);


module.exports = router;
