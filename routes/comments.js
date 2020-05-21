const express 	 = require("express"),
	  router  	 = express.Router({mergeParams: true}),
	  Campground = require("../models/campground"),
	  Comment 	 = require("../models/comment"),
	  middleware = require("../middleware");

//COMMENTS ROUTES
//===========================
router.get("/new", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

router.post("/", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res,redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	});
});
//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnerShip, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if (err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});
//COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnerShip, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			req.flash("error","Comment wasnt updated!");
			res.redirect("back");
		} else {
			req.flash("success","Comment successfully edited.");
			res.redirect("/campgrounds/" + req.params.id);
	}
	});
});
//COMMENT DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnerShip, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if (err) {
			req.flash("error","Cannor delete this comment.");
			res.redirect("back");
		} else {
			req.flash("success","Comment successfully deleted.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;
