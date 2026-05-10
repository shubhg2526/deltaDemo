const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
// const { listingSchema } = require("../Schema.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://imgs.search.brave.com/Dqjc1JI8g18t2SZoImKnuTVXhfU0HV5XjYhOIzYrbb8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50LnNreXNjbnIu/Y29tL20vMGY1YmRh/MTYxMTY5M2M0ZS9M/aWdodC1sYW5naGFt/LWhvdGVsLmpwZz9j/cm9wPTM5MnB4OjE4/NHB4JnF1YWxpdHk9/ODA",
            set: (v) => v === "" ? "https://imgs.search.brave.com/Dqjc1JI8g18t2SZoImKnuTVXhfU0HV5XjYhOIzYrbb8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50LnNreXNjbnIu/Y29tL20vMGY1YmRh/MTYxMTY5M2M0ZS9M/aWdodC1sYW5naGFt/LWhvdGVsLmpwZz9j/cm9wPTM5MnB4OjE4/NHB4JnF1YWxpdHk9/ODA" : v
        }
    },
    price: Number,
    location: {
        type: String
    },
    country: {
        type: String
    },
    //ye reviews vala part phase 2 se start hua hai...
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id : {$in: listing.reviews}})
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;


// owner add krne k rules:
// 1) sbse phle humne listing k model m owner ka property add krdi.
// 2) fir humne init folder m index.js k ander jakr....insert vali line se phle...har data  obj pe map function lgakr owner add kiya...sbka 1 hi owner rakh diya.
// 3) then routes folder m listing.js m jakr....show routes m populate owner add kiya
// 4) then show.ejs m jakr....owner ko UI pe show krdia.
// 5) then routes folder m listing.js m jakr....create route m ek line add krenge
//    newListing.owner = req.user._id;