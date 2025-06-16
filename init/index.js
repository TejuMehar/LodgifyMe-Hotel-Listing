 const mongoose = require('mongoose');
const { data: sampleListings } = require('./data'); // Adjust path if needed
const Listing = require('../models/listing.js');


const MONGO_URL = 'mongodb://localhost:27017/lodgifyMe';
async function main() {
    await mongoose.connect(MONGO_URL);
}
main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


const initDB = async () => {
  await Listing.deleteMany({});
  console.log(sampleListings[0]);

  await Listing.insertMany(sampleListings);
  console.log('Database initialized with initial data');
};

initDB();