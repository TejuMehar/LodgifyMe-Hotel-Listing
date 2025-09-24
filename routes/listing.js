const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js'); // Assuming you have a utility function for async error handling
const ExpressError = require('../utils/ExpressError.js'); // Assuming you have a custom error class for handling errors
const { listingSchema, reviewSchema } = require('../schema.js'); // Assuming you have a schema defined in schema.js
const Listing = require('../models/listing'); // Assuming you have a Listing model defined in models/listing.js
const mongoose = require('mongoose');



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
    res.render('listings/index.ejs', { allListings });
});

//new Route
router.get("/new",async (req,res)=>{
    if(!req.isAuthenticated()){
      req.flash("error","You Must be login to create Listing");
       return res.redirect("/login");
    }
     res.render("listings/new.ejs");
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
    req.flash("error","Listings you Requested for Does Not Exist !")
    res.redirect("/listings");
  }
  res.render('listings/show.ejs', { listing });
}));

//Create Route
router.post("/", validateListing, wrapAsync(async (req, res) => {
  let newlisting = new Listing(req.body.listing);
  await newlisting.save();
  req.flash("success","New Listing Created !");
  res.redirect("/listings");
}));

// Edit Route
router.get("/:id/edit", async(req,res)=>{
  let {id} = req.params;
  let listing  = await Listing.findById(id);
   if (!listing) {
    req.flash("error","Listings you Requested for Does Not Exist !")
    res.redirect("/listings");
  }
   res.render("listings/edit.ejs", { listing});
});
//Update Route
router.put("/:id", validateListing, async (req, res) => {
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
   req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
});


//Delete Route
router.delete("/:id/delete",async(req,res)=>{
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
   req.flash("error","Listing Deleted!");
  res.redirect("/listings");
});


module.exports = router;
