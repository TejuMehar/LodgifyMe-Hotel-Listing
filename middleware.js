module.exports.isLoggedIn = async(req,res,next)=>{
 if(!req.isAuthenticated()){
      req.flash("error","You Must be login to create Listing");
       return res.redirect("/login");
    }
    next();
}