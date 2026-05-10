// authentication and authorisation krne k liye..sbse phle humne 3 chiz install krni hoti hai...
// npm i passport,     npm i passport-local,     npm i passport-local-mongoose
// fir phle passport ko require kr lenge...fir localStrategy = passport-local ko require kr lenge
// then models folder m ek user naam se model bnana hai...
// fir isko apne app.js m require kr denge..

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);                             // ye line khudh add kr deti hai username and password.

const User = mongoose.model("User", userSchema);
module.exports = User;

