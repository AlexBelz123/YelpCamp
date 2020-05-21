const Campground = require("../models/campground"),
	  Comment	 = require("../models/comment");

const middlewareObj = {};

middlewareObj.checkCommentOwnerShip = (req, res, next) => {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
		if (err || !foundComment) {
			req.flash("error", "Cannot found Comment");
			res.redirect("back");
		} else {
			if (foundComment.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You do not have permission to do that");
				res.redirect("back");
			}
		}
	});
	} else {
		req.flash("error", "You need to be Logged In first");
		res.redirect("back");
	}
}

middlewareObj.checkCampgroundOwnerShip = (req, res, next) => {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
		if (err || !foundCampground) {
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			if (foundCampground.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You do not have permission to do that");
				res.redirect("back");
			}
		}
	});
	} else {
		req.flash("error", "You need to be Logged In first");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You have to be logged in!");
	res.redirect("/login");
}

module.exports = middlewareObj;