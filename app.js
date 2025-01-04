// app.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require("ejs-mate");
// const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/review');
const userRoutes  = require('./routes/user');
const session = require('express-session');
const { date } = require('joi');
const flash = require("connect-flash");
// we require three for my making authorization and authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const sessiionOptions = {
  secret: "mysecretsonu",
  resave: false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() +  7*24*60*60*1000,
    maxAge:  7*24*60*60*1000,
    httpOnly:true,
  }
};


app.get('/', (req, res) => {
  res.send("I am working here");
});

app.use(session(sessiionOptions));
app.use(flash());
//for login signup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()) );


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();

})

app.get("/demouser",async(req,res)=>{
  
  let fakeUser = new User({
    email:"monu@gmail.com",
    username:"monu",
  });


  let registeredUser = await User.register(fakeUser,"monu12");
  res.send(registeredUser);


});




const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("connected with database");
}
main().catch((err) => {
  console.error(err);
});

// Routes
app.use('/listings', listingRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/',userRoutes);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!...."));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong " } = err;
  res.status(statusCode).render('listings/error.ejs', { message });
});

app.listen(3000, () => {
  console.log("server is listening");
});



// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const Listing = require("./models/listing.js")
// const path = require('path');
// const { resolveSoa } = require('dns');
// const methodOverride = require('method-override');
// const ejsMate = require("ejs-mate");
// const wrapAsync = require('./utils/wrapAsync.js');
// const ExpressError = require('./utils/ExpressError.js');
// const {listingSchema,reviewSchema} = require("./schema.js");
// const Review  = require("./models/review.js");



// app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"))
// app.use(express.urlencoded({extended:true}))
// app.use(methodOverride("_method"));
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// main()
// .then(() =>{
//   console.log("connected with database")

// })
//   .catch((err)=>{
//     console.log(err);

//   })

// async function main(){
//   await mongoose.connect(MONGO_URL)
// }
// // app.get('/testListing',async(req,res)=>{
// //   let sampleListings= new Listing({
// //     title: "farm houses avaible",
// //    discription: "this is amazing place for spend time with sukoon",
// //    price : 15000,
// //    location:"india bich,goa",
// //    countary:"india"
   
// //   })
// //   await sampleListings.save();
    
// //   console.log("sample is saved to database")
// //   res.send("your data is saved");
// // });
// const validateListing = (req,res,next) =>{
//   let {error} = listingSchema.validate(req.body);
//   if(error){
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400,errMsg);

//   }else{
//     next();
//   }
// }

// const validateReview = (req,res,next) =>{
//   let {error} = reviewSchema.validate(req.body);
//   if(error){
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400,errMsg);

//   }else{
//     next();
//   }
// }


// app.get('/listings',wrapAsync(async(req,res)=>{
//     const allListings = await Listing.find({});
//     res.render('listings/index.ejs',{allListings});
 
// })
// );


// // route to add new lsiting
// app.get('/listings/new',(req,res)=>{
//   res.render('listings/new.ejs')
// })

// app.post(
//   '/listings',validateListing,
//   wrapAsync(async (req, res, next) => {
//     // Create new listing from form data
   
//     const newListing = new Listing(req.body.listing);
//     await newListing.save(); // Save to database
//     res.redirect('/listings'); // Redirect on success
//   })
// );
// // app.post('/listings', async (req, res) => {
// //   const { title, description, image, price, country, location } = req.body.listing;
  
// //   try {
// //       const newListing = new Listing({
// //           title,
// //           description,
// //           image, // Ensure this is being saved
// //           price,
// //           country,
// //           location
// //       });
// //       await newListing.save();
// //       res.redirect('/listings');
// //   } catch (err) {
// //       console.error('Error saving the listing:', err);
// //       res.status(500).send('Error saving the listing.');
// //   }
// // });





// // app.post('/listings', (req, res) => {
// //   console.log(req.body);
// //   res.send('Check your console');
// // });


// app.get('/listings/:id/edit',wrapAsync(async(req,res)=>{
//           let {id} = req.params;
//           const listing = await Listing.findById(id);
//           res.render('listings/edit.ejs',{listing})
 
     
//   })
// );
// app.put('/listings/:id',validateListing,wrapAsync(async(req,res)=>{
 
//   let {id} = req.params;
//  await Listing.findByIdAndUpdate(id,{...req.body.listing});
//  res.redirect(`/listings/${id}`)

// })
// );
// app.delete('/listings/:id',wrapAsync(async(req,res)=>{
//   let {id} = req.params;
//  await Listing.findByIdAndDelete(id);
//  res.redirect('/listings' )

// })
// );

// app.get('/listings/:id',wrapAsync(async(req,res)=>{
//   let {id} = req.params;
//   try{
//     const listing = await Listing.findById(id).populate("reviews");


//       if(!listing){
//             return res.status(404).send("Listing not found");
//           }
//         res.render('listings/show.ejs',{listing});

//         }catch(err){
//           res.status(500).send("Error retrieving listing");
//         }
  
  

// })
// );

// // add comment route 

// app.post(
//   "/listings/:id/reviews",
//   validateReview,
//   wrapAsync(async (req, res) => {
//     // Fetch listing by ID
//     const listing = await Listing.findById(req.params.id);
//     console.log(listing);

//     // If listing does not exist, throw error
//     if (!listing) {
//       throw new ExpressError(404, "Listing not found");
//     }

//     // Create and associate new review
//     const newReview = new Review(req.body.review);
//     listing.reviews.push(newReview);

//     // Save both the review and listing
//     await newReview.save();
//     await listing.save();

//     // Redirect to the listing's detail page
//     res.redirect(`/listings/${listing._id}`);
//   })
// );

// // route for delete a commnet
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res) =>{
//   let {id,reviewId} = req.params;
//   await Listing.findByIdAndUpdate(id,{pull:{reviews: reviewId}});
//   await Review.findByIdAndDelete(reviewId);
//   res.redirect(`/listings/${id}`);
// }))


// app.get('/',(req,res)=>{
//   res.send("i m working here")
// });

// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404,"Page not Found!...."))
// });

//  app.use((err,req,res,next)=>{
// //   here we deconstruct the info from upcoming request and we extract info
//   let{statusCode = 500,message="Something went wrong "} = err;
//    res.status(statusCode).render('listings/error.ejs',{message});
//    //res.status(statusCode).send(message);
// });

// app.listen(3000,()=>{
//   console.log("server is listening");
// });
