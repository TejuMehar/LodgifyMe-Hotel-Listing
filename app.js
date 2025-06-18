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
const { listingSchema } = require('./schema.js'); // Assuming you have a schema defined in schema.js
const  Review = require('./models/review.js'); // Assuming you have a Review model defined in models/review.js




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

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// app.get('/testListings', async(req,res)=>{
//  let listings =  new Listing({
//     title: "Testeeeee Listing",
//     description: "This is a test listing",
//     image: "https://via.placeholder.com/150",
//     location: "Test Location",
//     country: "Test Country"
//   });
//   await listings.save().then(() => {
//     res.status(200).json({ message: "Listing created successfully", listing: listings });
//     console.log("Listing created successfully");
//   }).catch(err => {
//     res.status(500).json({ message: "Error creating listing", error: err });
//   });


//  });


 //Index Route
app.get('/listings', async (req, res) => {
    let allListings =  await Listing.find({});
    res.render('listings/index.ejs', { allListings });
});


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

//new Route
app.get("/listings/new",async (req,res)=>{
    
     res.render("listings/new.ejs");
})


//Show Route
app.get('/listings/:id', wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // If not a valid ObjectId, show 404 page
    return res.status(404).render('listings/Error.ejs', { status: 404, message: 'Page Not Found' });
  }
  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).render('listings/Error.ejs', { status: 404, message: 'Page Not Found' });
  }
  res.render('listings/show.ejs', { listing });
}));

//Create Route
app.post("/listings",validateListing ,wrapAsync(async(req,res)=>{
     let newlisting = new Listing (req.body.listing);
     await newlisting.save();
    res.redirect("/listings");
}));

// Edit Route
app.get("/listings/:id/edit", async(req,res)=>{
  let {id} = req.params;
  let listing  = await Listing.findById(id);
   res.render("listings/edit.ejs", { listing});
});

//Update Route

app.put("/listings/:id",validateListing, async(req,res)=>{
  let { id } = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
  // Redirect to the show page for this listing
   res.redirect(`/listings/${id}`);
});

//Delete Route

app.delete("/listings/:id/delete",async(req,res)=>{
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});


//Reviews Routes
//post new review
app.post('/listings/:id/reviews', async (req, res) => {
   let { id } = req.params;
   let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    res.redirect(`/listings/${id}`);
});

// app.all('*', (req, res, next) => {
//   next(err);
// });

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
