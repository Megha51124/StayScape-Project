const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing,saveRedirectUrl,isBookingOwner} = require("../middleware.js");
const bookingController = require("../controllers/booking.js");
const router = express.Router({ mergeParams: true });


router.get(
    "/:id/bookings/new",
     isLoggedIn,
    wrapAsync(bookingController.renderNewForm)
)

router.post(
    "/:id/bookings", 
    isLoggedIn, wrapAsync(bookingController.createBooking)
);

router.get(
    "/bookings/my-bookings",
    isLoggedIn,
    wrapAsync(bookingController.myBookings)
)

router.delete(
    "/bookings/:bookingId",
      isLoggedIn,
      isBookingOwner,
      wrapAsync(bookingController.destroyBooking)
)

module.exports = router;