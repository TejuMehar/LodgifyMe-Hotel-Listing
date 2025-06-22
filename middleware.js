  module.exports.isLogedIn =(req,res,next)=>{
 if (!req.isAuthenticated()) {
  //Redirect url 
  //  req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing");
    return res.redirect("/login"); // ✅ return stops execution here
  } };
  

  module.exports.saveRedirectUrl =  (req,res,next)=>{
    if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
  }