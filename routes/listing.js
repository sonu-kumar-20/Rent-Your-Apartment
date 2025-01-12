const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require("../schema.js");
const ExpressError = require('../utils/ExpressError.js');
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Get all listings
router.get('/', wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index.ejs', { allListings });
}));

// New listing form
router.get('/new',isLoggedIn, (req, res) => {
  if(!req.isAuthenticated()){
    req.flash("error","You must be logged for add listings");
    return  res.redirect("/login");
  }
  res.render('listings/new.ejs')
 
 
});

// Create new listing
router.post('/',isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success" ,"New Listing is added");
  res.redirect('/listings');
}));

// Edit listing form
router.get('/:id/edit', isLoggedIn,wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing });
}));

// Update listing
router.put('/:id',isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success" ,"Your listing is Updated");
  res.redirect(`/listings/${id}`);
}));

// Delete listing
router.delete('/:id', isLoggedIn,wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success" ," Listing is deleted");
  res.redirect('/listings');
}));

// Show listing details
router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
   req.flash("error","your listing does not exist")
   res.redirect('/listings')
  }
  res.render('listings/show.ejs', { listing });
}));

module.exports = router;
