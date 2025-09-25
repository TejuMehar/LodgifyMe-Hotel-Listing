const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        // Wait for registration to complete
        await User.register(newUser, password);
         req.login(newUser,(err)=>{
            if(err){
                next(err);
            }else{
                 req.flash("success", "User Registered Successfully!");
                return res.redirect("/listings");  // return to prevent further execution
            }
         })
       
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup"); // redirect back to signup on error
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});



router.post("/login", passport.authenticate('local',{failureRedirect: '/login',failureFlash:true}),
(req,res)=>{
//    console.log("Logged in user:", req.user); 
   req.flash("success","Welcome to LodgiFyMe!");
   res.redirect("/listings");
});


router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success", "You have successfully logged out!");
        res.redirect('/listings');
    });
});

module.exports =router;
