const Listing = require("./models/listing.js");

module.exports.isLoggedIn = (req,res,next)=>{
 if(!req.isAuthenticated()){
       //Rediresct URL 
       req.session.redirectUrl =req.originalUrl;
      req.flash("error","You Must be login to create Listing");
       return res.redirect("/login");
    }
    next();
}



module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
}
next();
}

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listings you Requested for Does Not Exist !");
    return res.redirect("/listings");
  }

  const currentUserId = (res.locals.currUser && res.locals.currUser._id) || (req.user && req.user._id);
  if (!currentUserId || !listing.owner || !listing.owner.equals(currentUserId)) {
    req.flash("error", "You Don't have Permission To Edit!");
    return res.redirect(`/listings/${id}`);
  }

  next();
}

