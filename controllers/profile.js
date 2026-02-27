const User = require("../models/user");

module.exports.renderProfilPage = (req, res) => {
  res.render("user/profile", { user: req.user });
};

module.exports.wishlist = async (req, res) => {
    const listingId = req.params.id;
    const user = await User.findById(req.user._id);

    if (user.wishlist.includes(listingId)) {
        user.wishlist.pull(listingId);
    } else {
        user.wishlist.push(listingId);
    }

    await user.save();

   res.redirect("/wishlist");
};

// WISHLIST PAGE
module.exports.renderWishlistPage = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.render("user/wishlist", { listings: user.wishlist });
};

module.exports.addWishlist =  async (req, res) => {
  const user = await User.findById(req.user._id);
  const listingId = req.params.id;

  if (!user.wishlist.includes(listingId)) {
    user.wishlist.push(listingId);
    await user.save();
  }
   req.flash("success", "Added to wishlist");
  res.redirect("/wishlist");
}

module.exports.destroyWishlist = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { wishlist: req.params.id }
  });

  req.flash("success", "Removed from wishlist");
  res.redirect("/wishlist");
};


