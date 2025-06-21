const express  = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
   try{
    let {username,email,password} = req.body;
     const newUser =   new User({email,username});
    const registerUser = await User.register(newUser,password);
    req.flash("success","User was Successfully Registered!");
    // console.log(registerUser);
    res.redirect("/listings");
   }catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
   }
   
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});


module.exports = router;
