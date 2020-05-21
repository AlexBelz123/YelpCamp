const express  = require("express"),
	  passport = require("passport"),
	  User	   = require("../models/user"),
	  router   = express.Router();

router.get("/", (req, res) => {
	res.render("landing");
});
//AUTH ROUTES
//sign up
router.get("/register", (req, res) =>{
	res.render("register");
});

router.post("/register", (req, res) => {
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if (err || !user) {
			req.flash("error", err.message);
			return res.redirect("back");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to the YelCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});
//login
router.get("/login", (req, res) => {
	res.render("login");
});
//login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),(req, res) => {});

//logout logic
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You successfully have been logged out!");
	res.redirect("/campgrounds");
});

module.exports = router;