const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

const controllerUser = require("../controllers/user.js");

//signup vala part
router.get("/signup", controllerUser.renderSignupForm);

router.post("/signup", wrapAsync(controllerUser.signup));

// login vala part
router.get("/login", controllerUser.renderLoginForm);

router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync(controllerUser.login));


// logout vala part
router.get("/logout", controllerUser.logout);

module.exports = router;