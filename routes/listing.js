const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const wrapAsync = require('../utils/wrapAsync.js'); // Assuming you have a utility function for async error handling
const ExpressError = require('../utils/ExpressError.js'); // Assuming you have a custom error class for handling errors
const { listingSchema, reviewSchema } = require('../schema.js'); // Assuming you have a schema defined in schema.js
const Listing = require('../models/listing'); // Assuming you have a Listing model defined in models/listing.js
const { sendListingConfirmationEmail } = require("../utils/mailer.js");
const { isLogedIn }= require('../middleware.js');

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


 //Index Route
router.get('/', async (req, res) => {
    let allListings =  await Listing.find({});
     return res.render('listings/index.ejs', { allListings });
});

//new Route

router.get("/new",isLogedIn ,(req, res) => {
 if(!req.isAuthenticated()) {
    // If user is not authenticated, redirect to login page
  req.flash("error","you must be login") // ✅ only runs if authenticated
  res.redirect("/listings");
  } else {
    // If user is authenticated, render the new listing form
    res.render("listings/new.ejs");
  }
});

//Show Route
router.get('/:id', wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // If not a valid ObjectId, show 404 page
    return res.status(404).render('listings/Error.ejs', { status: 404, message: 'Page Not Found' });
  }
  const listing = await Listing.findById(id).populate('reviews');
  if (!listing) {
    req.flash("error","Listing you requested for does not Exist!");
    return res.status(404).render('listings/Error.ejs', { status: 404, message: 'Page Not Found' });
  }
  res.render('listings/show.ejs', { listing });
}));

//Create Route
router.post("/", validateListing, wrapAsync(async (req, res) => {
  let newlisting = new Listing(req.body.listing);
  await newlisting.save();

  // 👇 send listing confirmation email
 await sendListingConfirmationEmail(req.user.email, req.user.username, newlisting.title);
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
}));

// Edit Route
router.get("/:id/edit",isLogedIn ,async(req,res)=>{
  let {id} = req.params;
  let listing  = await Listing.findById(id);
   res.render("listings/edit.ejs", { listing});
});


//Update Route
router.put("/:id",isLogedIn ,validateListing, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  // If image field is empty, keep the old image (handle both string and object)
  if (!req.body.listing.image || req.body.listing.image.trim() === "") {
    if (typeof listing.image === "object" && listing.image.url) {
      req.body.listing.image = listing.image.url;
    } else {
      req.body.listing.image = listing.image;
    }
  }

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   req.flash("success","Listing is Updated!");
  res.redirect(`/${id}`);
});
//Delete Route
router.delete("/:id", isLogedIn, async (req, res) => {
  let { id } = req.params;
  console.log("Delete request for ID:", id); // Add this line
  const deleted = await Listing.findByIdAndDelete(id);
  console.log("Deleted:", deleted); // Add this line
  req.flash("success", "Listing is Deleted!");
  res.redirect("/listings");
});


module.exports = router;
