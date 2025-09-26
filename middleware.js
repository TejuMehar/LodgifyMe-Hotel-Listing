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

module.exports.isOwner = async(req,res,owner) =>{
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
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You Don't have Permission To Edit!");
     return res.redirect(`/listings/${id}`);
  }
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
}