const express 	    = require("express"),
	  app 			= express(),
	  flash			= require("connect-flash"),
	  bodyParser    = require("body-parser"),
	  mongoose      = require("mongoose"),
	  passport	    = require("passport"),
	  LocalStrategy = require("passport-local"),
	  methodOverride = require("method-override"),
	  Campground    = require("./models/campground"),
	  Comment 	    = require("./models/comment"),
	  User 		    = require("./models/user"),
	  seedDB        = require("./seeds");

//requering routes
const campgroundRoutes = require("./routes/campgrounds"),
	  commentRoutes    = require("./routes/comments"),
	  indexRoutes	   = require("./routes/index");

//mongodb://localhost:27017/yel_camp_v7
//"mongodb+srv://alex_belz:aswe3456@yelcamp-zrzm8.mongodb.net/test?retryWrites=true&w=majority"
const url = process.env.DATABASEURL || "mongodb://localhost:27017/yel_camp_v12";

mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}).then(() => {
	console.log("Connected to mongoDb");
}).catch(err => {
	console.log("ERROR: ", err.message);
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
//seedDB(); //seed database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Everybody can laugh of me. Nobody can cry for others..",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT || 3000, (req, res) => {
	console.log("The YelCamp Server has started!");
});