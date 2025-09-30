const User = require('../models/user'); // Assuming you have a User model defined in models/user.js
const sendWelcomeMail = require('../utils/Nodemailer.js');


module.exports.renderRegister = (req,res)=>{
    res.render("users/signup.ejs");
}


module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        // Wait for registration to complete
        await User.register(newUser, password);

         req.login(newUser,async(err)=>{
            if(err){
                next(err);
            }else{
               await sendWelcomeMail(email, username)
                 req.flash("success", "User Registered Successfully!");
                return res.redirect("/listings");  // return to prevent further execution
            }
         })
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup"); // redirect back to signup on error
    }
}


module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome to LodgiFyMe!");
    const redirectUrl = res.locals.redirectUrl || "/listings"; // fallback
    delete req.session.redirectUrl; // cleanup
    res.redirect(redirectUrl);
  }


  module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success", "You have successfully logged out!");
        res.redirect('/listings');
    });
}