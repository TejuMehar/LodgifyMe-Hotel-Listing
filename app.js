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


//new Route
app.get("/listings/new",async (req,res)=>{
    
     res.render("listings/new.ejs");
})


//Show Route
app.get("/listings/:id", async(req,res)=>{
  let {id} = req.params;
  let listing =  await Listing.findById(id);
  res.render("listings/show.ejs",{ listing });
})


//Create Route
app.post("/listings", async(req,res)=>{
      // let { title,description,price,location,image,country} = req.body;
    let newlisting = new Listing (req.body.listing);
     await newlisting.save();
    res.redirect("/listings");
});

// Edit Route
app.get("/listings/:id/edit", async(req,res)=>{
  let {id} = req.params;
  let listing  = await Listing.findById(id);
   res.render("listings/edit.ejs", { listing});
});

//Update Route

app.put("/listings/:id",async(req,res)=>{
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
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
