const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const {isLoggedIn,isOwner,validateListing,saveRedirectUrl} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.get(
  "/search",
  listingController.search
);

router.route("/")
//Index Route
.get( wrapAsync(listingController.index))
//Update/Create Route
.post(
   isLoggedIn,
   upload.single("listing[image]"),
    validateListing,
  wrapAsync(listingController.createListing)
);


//New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//edit form
router.get(
  "/:id/edit",
  isLoggedIn,
    isOwner,
  listingController.renderEditForm
)

router.route("/:id")
//Show route
.get(listingController.showListing)
//Udate Route
.put(isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing, wrapAsync(listingController.updateListing)
)
//DELETE Route
.delete(isLoggedIn, 
  isOwner,
  wrapAsync(listingController.destroyListing)
)


router.get(
  "/search",
  listingController.search
);

module.exports = router;