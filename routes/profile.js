const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.js");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync.js");

router.get(
    "/profile",
    isLoggedIn,
    profileController.renderProfilPage
);

router.get(
    "/wishlist",
    isLoggedIn,
    wrapAsync(profileController.renderWishlistPage)
);


router.post(
    "/wishlist/:id",
    isLoggedIn,
    wrapAsync(profileController.addWishlist)
);

router.delete(
    "/wishlist/:id",
    isLoggedIn,
     wrapAsync(profileController.destroyWishlist)
);

module.exports = router;