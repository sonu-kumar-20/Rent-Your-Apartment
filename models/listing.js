const mongoose = require('mongoose');


const Review = require('./review.js');


const { Schema } = mongoose; // Destructure Schema from mongoose

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  image: {
    type: String,
    default:
      "https://i.pinimg.com/originals/5c/d2/49/5cd2497289b0f88c3bac2ba4aa49c88e.jpg",
    set: (v) =>
      v === "" 
        ? "https://i.pinimg.com/originals/5c/d2/49/5cd2497289b0f88c3bac2ba4aa49c88e.jpg" 
        : v,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});


listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews} });
  }
})

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
