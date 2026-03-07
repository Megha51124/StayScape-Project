const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({ mergeParams: true });
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//Create Review
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));


//Delete Reveiew
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports = router;