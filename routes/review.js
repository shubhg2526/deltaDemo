const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");                     // ye error handling ka part hai..
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { listingSchema, reviewSchema } = require("../Schema.js");                     // ye alag se file bnai hai schema.js k naam se
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewOwner} = require("../middleware.js");

const controllerReview = require("../controllers/review.js");


// jo humne form k ander required likha tha....usko bolte hai client side validation
// or jo ye hai neeche...isko bolte hai server side validation.
// or iske liye ke alag se schema.js file bhi bnai h humne and joi ko install bhi kiya hai.
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Review route
router.post("/", isLoggedIn,  validateReview, wrapAsync(controllerReview.createReview));


// delete review route
router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(controllerReview.destroyReview));

module.exports = router;