const express  = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { sendWelcomeEmail } = require("../utils/mailer.js"); // adjust the path if needed
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);

    await sendWelcomeEmail(email, username);

    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash("success", "User was Successfully Registered!");
      res.redirect("/listings");
    });

  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
}));

//User Loging Process i
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});

router.post("/login",saveRedirectUrl ,
  passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
}), async(req, res) => {
  req.flash("success", "Welcome to LodgifyMe!");
  // res.redirect(req.session.redirectUrl);
  res.redirect("/listings");
});

router.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err){
    next(err); 
    }
    req.flash("success","Your Are Logout !");
  res.redirect("/listings");
  });

})

module.exports = router;
