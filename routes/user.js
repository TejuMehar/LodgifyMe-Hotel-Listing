const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userControllers = require('../controllers/userControllers.js');
const user = require('../models/user.js');

router.route('/signup').get(userControllers.renderRegister)
.post(wrapAsync(userControllers.register));

router.route('/login').get(userControllers.renderLogin)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),userControllers.login
);


router.get("/logout",userControllers.logout);

module.exports =router;
