const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");                     // ye error handling ka part hai..
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../Schema.js");                     // ye alag se file bnai hai schema.js k naam se
const {isLoggedIn, isOwner} = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// jo humne form k ander required likha tha....usko bolte hai client side validation
// or jo ye hai neeche...isko bolte hai server side validation.
// or iske liye ke alag se schema.js file bhi bnai h humne and joi ko install bhi kiya hai.
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//all listings
router.get("/", wrapAsync(listingController.index));


// new and create route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.post("/", validateListing, isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.createListing));


// show route
router.get("/:id", wrapAsync(listingController.showListing));


// edit and update route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync(listingController.updateListing));


//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;