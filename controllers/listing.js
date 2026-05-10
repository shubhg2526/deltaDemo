const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listing/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listing/new.ejs");
};

module.exports.createListing = (async (req, res) => {
    let  url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body.listing
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;                               // owner se related line hai ye
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New listing created");                   // ye humne flash add kiya hai.
    // console.log(listing);
    res.redirect("/listings");
});

module.exports.showListing = (async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    console.log(listing);
    res.render("./listing/show.ejs", { listing });
});

module.exports.renderEditForm = (async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listing/edit.ejs", { listing });
});

module.exports.updateListing = (async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
});

module.exports.destroyListing = (async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
});

