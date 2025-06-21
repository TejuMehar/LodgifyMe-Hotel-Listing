const express  = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const  sendWelcomeEmail = require('../utils/mailer.js');

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
   try{
    let {username,email,password} = req.body;
     const newUser = new User({email,username});
    const registerUser = await User.register(newUser,password);
    await sendWelcomeEmail(email, username);
    req.flash("success","User was Successfully Registered!");
    // console.log(registerUser);
    res.redirect("/listings");
   }catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
   }
   
}));

//User Loging Process i
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
}), async(req, res) => {
  req.flash("success", "Welcome to LodgifyMe!");
  res.redirect("/listings");
});


module.exports = router;
