const mongoose = require('mongoose');
const { data: sampleListings } = require('./data'); // Adjust path if needed
const Listing = require('../models/listing.js');

const MONGO_URL = 'mongodb://localhost:27017/lodgifyMe';

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

const initDB = async () => {
  await Listing.deleteMany({});

  // new variable वापरला ✅
  const listingsWithOwner = sampleListings.map(obj => ({
    ...obj,
    owner: "68d6a3ec4a856439e8954bcc"
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log('Database initialized with initial data');
};

initDB();
