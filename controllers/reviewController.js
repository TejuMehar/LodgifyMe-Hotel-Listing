const  Review = require('../models/review.js'); // Assuming you have a Review model defined in models/review.js
const Listing = require('../models/listing'); // Assuming you have a Listing model defined in models/listing.js


module.exports.postReview = async(req, res) => {

    const { id } = req.params;
   let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
     req.flash("success","New Review Created !");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
   req.flash("error","Review Deleted!");
  res.redirect(`/listings/${id}`);
}