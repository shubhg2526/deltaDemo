const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = ((req, res, next) => {
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in to create new listing!");
        return res.redirect("/login");
    }
    next();
});

// ye isliye likha hai...taaki hum dusre k listing ko edit na kr paye...
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


// ye isliye likha hai...taaki hum dusre k review ko edit ya delete na kr paye...
module.exports.isReviewOwner= async (req, res, next) => {
    let { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}