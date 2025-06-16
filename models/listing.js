
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
       type: String,
        required: true },
    description: { 
      type: String, 
      required: true },
    image: {
        // url: String // Only 'url' since your data only has 'url'
        url: {
        type: String,
        default: "https://via.placeholder.com/150"
       }
    },
    price: { 
      type: Number,
       required: true },
    location: { 
      type: String,
       required: true },
    country: { 
      type: String,
       required: true }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;


// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     image: {
//         type: String,
//         set: (v) => v=== ""?"https://via.placeholder.com/150": v,
//     },
//     price:{
//         type: Number,
//         required: true
//     },
//     location: {
//         type: String,
//         required: true
//     },
//     country: {
//         type: String,
//         required: true
//     },
// });


// const Listing = mongoose.model('Listing', listingSchema);
// module.exports = Listing;