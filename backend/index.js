const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const jsonWebToken = require("jsonwebtoken");
const jwtSecret = "fnr;nva4o5awbew/cvae";
const cookieParser = require("cookie-parser");
require("dotenv").config();
const Place = require("./models/Place");

const reviewsRouter = express.Router();

//const testRouter = require("./routes/test");
const booking = require("./routes/booking");
const user = require("./routes/user");
const profile = require("./routes/profile");
const place = require("./routes/place");
const unauthreview = require("./routes/unauthreview");
const authreview = require("./routes/authreview");
const upload = require("./routes/upload");
const index = require("./routes/index");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');

const path = require('path');
const { token } = require("morgan");
const { log } = require("console");
const port = process.env.PORT || 5173;

// Routes
const app = express();
app.use("/reviews", reviewsRouter);
app.use("/uploads", express.static(__dirname + "/uploads"));

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Move the database connection outside of the route handlers
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const jwtmiddleWare = (req, res, next) => {

  if (!req.cookies || !req.cookies.token) {
    return res
      .status(401)
      .json({ error: "Unauthorized, no valid token provided" });
  }
  jsonWebToken.verify(
    req.cookies.token,
    jwtSecret,
    {},
    async (err, userData) => {
      if (err) {
        // Properly reject the promise if an error occurred during verification
        return res.status(401).json({ error: err.message });
      }
      res.locals.userData = userData;
      next();
    }
  );
};

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    if (!req.cookies || !req.cookies.token) {
      // If the token doesn't exist in cookies, reject the promise
      return reject(new Error("No token provided"));
    }

    jsonWebToken.verify(
      req.cookies.token,
      jwtSecret,
      {},
      async (err, userData) => {
        if (err) {
          // Properly reject the promise if an error occurred during verification
          return reject(err);
        }
        resolve(userData);
      }
    );
  });
}

//end points for test page
//app.use('/screen', jwtmiddleWare, testRouter);
////booking///////
app.use("/bookings", jwtmiddleWare, booking);

////////  REGISTER, LOGIN/LOGOUT & PROFILE  ///////////
app.use("/user", user);
app.use("/user", jwtmiddleWare, profile);

////////  PLACES  ///////////
app.use("/places", jwtmiddleWare, place);

app.get("/public/places", async (req, res) => {
  res.json(await Place.find());
});

// review
app.use("/reviews", unauthreview);
app.use("/reviews", jwtmiddleWare, authreview);

//upload
app.use("/upload", upload);

app.use("/", index);

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
