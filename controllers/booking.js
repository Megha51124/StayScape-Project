const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");


  module.exports.renderNewForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    const existingBookings = await Booking.find({ listing: id });

    const bookedRanges = existingBookings.map((booking) => ({
      from: booking.checkIn.toISOString().split("T")[0],
      to: booking.checkOut.toISOString().split("T")[0],
    }));

    res.render("bookings/new", { listing, bookedRanges });
  };



  module.exports.createBooking = async(req,res)=>{
    
    let {id} = req.params;
    let {checkIn,checkOut} = req.body.booking;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if(checkOutDate<=checkInDate){
      req.flash("error","Check-out date must be after check-in date.");
      return res.redirect(`/listings/${id}/bookings/new`);
    }

    const overlap = await Booking.findOne({
      listing:id,
      checkIn: {$lt:checkOutDate},
      checkOut: {$gt:checkInDate},
    });

    if(overlap){
       req.flash("error", "These dates are already booked. Please choose different dates.");
    return res.redirect(`/listings/${id}/bookings/new`);
    }

     const listing = await Listing.findById(id);
  const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
  const totalPrice = nights * listing.price;

  const newBooking = new Booking({
    listing: id,
    user: req.user._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice,
  });

  await newBooking.save();

  req.flash("success", `Booking confirmed! Total: ₹${totalPrice}`);
  res.redirect(`/listings/${id}`);

     
  }

  module.exports.myBookings = async(req,res)=>{
   let bookings= await Booking.find({user:req.user._id}).populate("listing");
    res.render("bookings/my-bookings" ,{bookings})
  }

module.exports.destroyBooking = async(req,res)=>{
       let {bookingId} = req.params;
        await Booking.findByIdAndDelete(bookingId);
        req.flash("success","Booking deleted!");
        res.redirect("/bookings/my-bookings");
       
}