const express = require("express");
const router = express.Router();
const passport = require("passport");
const {saveRedirectUrl,validateLogin} = require("../middleware.js");

const userController = require("../controllers/user.js");

router.route("/signup")
//Sing-Up
.get( userController.rederSignUpForm)
.post( userController.signUp);


router.route("/login")
//Login
.get( userController.renderLoginForm)
.post(
    saveRedirectUrl, 
    passport.authenticate(
        "local", { 
            failureRedirect: "/login", 
            failureFlash: true
        }), 
        userController.login
    );


router.get("/logout", userController.logOut);


module.exports = router;