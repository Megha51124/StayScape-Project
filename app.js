if(process.env.NODE_ENV!="production"){
   require('dotenv').config();
}

const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingRouter= require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const profileRouter = require("./routes/profile.js");


app.set("view engine", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
  mongoUrl: dbUrl,   
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});


let sessionOptions ={
store,
secret: process.env.SECRET,
resave:false,
saveUninitialized:true,
cookie:{
  expires:Date.now() + 7*24*60*60*1000,
  maxAge:7*24*60*60*1000,
  httpOnly:true,
 },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.use("/", profileRouter);





//If a client tries to access the page (request for page/api does not exist) for that we will throw error . I will match all the above api's request , if not our custom error will be shown

app.use((req,res,next)=>{
    next(new ExpressError(404,'Page not found'));
})

app.use((err, req, res, next) => {
  let{status=500,message="Something Went Wrong"} = err;
   res.status(status).render("./listings/error.ejs",{message});
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
