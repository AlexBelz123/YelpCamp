const express    = require("express"),
	  Campground = require("../models/campground"),
	  middleware = require("../middleware"),
	  router     = express.Router();

//INDEX ROUTE
router.get("/", (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			console.log("SOMETHING WENT WRONG!")
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});;
		}
	});
});
//CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
	console.log(req.user);
	const name = req.body.name;
	const price = req.body.price;
	const image = req.body.image;
	const desc = req.body.description;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	const newCamp = {name: name, price: price, image: image, description: desc, author: author};
	Campground.create(newCamp, (err, newlyCreated) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});
//NEW
router.get("/new", middleware.isLoggedIn,(req, res) => {
	res.render("campgrounds/new");
});
//SHOW 
router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});
//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnerShip,(req, res) => {
		Campground.findById(req.params.id, (err, foundCampground) => {
			res.render("campgrounds/edit", {campground: foundCampground});
		});
	});
//UPDATE
router.put("/:id", middleware.checkCampgroundOwnerShip, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			req.flash("error", "Cannot edit Campground");
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground successfully edited.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//DELETE

router.delete("/:id", middleware.checkCampgroundOwnerShip, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			req.flash("error", "Cannot delete your campground");
			res.redirect("/campgrounds");
		} else {
			req.flash("success","Campground successfully deleted.");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;