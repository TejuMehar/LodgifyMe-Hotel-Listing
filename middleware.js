module.exports.isLoggedIn = async(req,res,next)=>{
 if(!req.isAuthenticated()){
    //Rediresct URL 
    //    console.log(req.session.redirectUrl = req.originalUrl);
    console.log(req);
      req.flash("error","You Must be login to create Listing");
       return res.redirect("/login");
    }
    next();
}

// module.exports.saveRedirectUrl = (req,res,next) =>{
//     if(req.session.redirectUrl) {
//         res.locals.redirectUrl = req.session.redirectUrl;
// }
// }
