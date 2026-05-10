if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const port = 8080;
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ab npm i express-session ko install kr lenge....fir require kr lenge
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

//ab npm i connect-flash ko install kr lenge...fir require kr lenge
const flash = require("connect-flash");

// ye express router ko require kiya hai humne..
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ye mongoose ka connection hai jo ki humne copy krke likha hai

//const mongoURL = "mongodb://127.0.0.1:27017/MakeMyTrip";
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connected to DB");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
})

//express session ko require krne k bd.....ye likhenge
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

store.on("error", () => {
    console.log("Error in mongo session store, err");
});

app.use(session(sessionOptions));
app.use(flash());

// ye 5 lines authentication ki hai...
app.use(passport.initialize());
app.use(passport.session());                          // kya vo user same hai vo hmari website k alag alag pages pe ja rha hai
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ye flash ka middleware hai
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//authentication k liye demoUser bnaya hai humne
// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "shubh123@gmail.com",
//         username: "shubh2526"
//     })

//     let registeredUser = await User.register(fakeUser, "helloworld");            // here 1st argument is user amd 2nd argument is password.
//     res.send(registeredUser);
// });


app.use("/listings", listingRouter);                 // ye line hai express router ki
app.use("/listings/:id/reviews", reviewRouter);      // ye line hai express router ki
app.use("/", userRouter);                            // ye line hai express router ki


app.get("/", (req, res) => {
    res.send("Hello, I'm Root");
});


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


//this is error handling middleware...
app.use((err, req, res, next) => {
    // console.log("Something went wrong!");
    let { statusCode = 500, message = "something went wrong!" } = err;
    res.status(statusCode).render("./listing/error.ejs", { message });
    // res.status(statusCode).send(message);
});


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});