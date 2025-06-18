
const mongoose = require('mongoose');
const review = require('./review');
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
        default: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG9tZXxlbnwwfHwwfHx8MA%3D%3D"
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
       required: true 
      },
     reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review' ,   
    }],

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