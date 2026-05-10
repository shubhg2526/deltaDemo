const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment : String,
    rating : {
        type: Number,
        max: 5,
        min: 1
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;


// review authorisation k rules..
// 1) phle review schema m author add kr denge
// 2) show.ejs m jakr....review vale form k uper condition lga denge...if(currUser)
// 3) routes folder m review.js m jakr....review routes k ander ek line add ki.
// 4) then routes folder k ander listing.js m populate k ander nested populate likha.
// 5) show.ejs m reviews k ander jakr....shubh gupta ki jagah....review.author.username krdiya.