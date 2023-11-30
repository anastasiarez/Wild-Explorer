const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(10);
const jsonWebToken = require("jsonwebtoken");
const jwtSecret = "fnr;nva4o5awbew/cvae";
const cookieParser = require("cookie-parser");
require("dotenv").config();
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const PlaceModel = require("./models/Place.js");
const Booking = require("./models/Booking.js");
const Review = require("./models/Review.js");
const reviewsRouter = express.Router();

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

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    if (!req.cookies || !req.cookies.token) {
      // If the token doesn't exist in cookies, reject the promise
      return reject(new Error('No token provided'));
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
////// STRIPE //////

app.post('/place/:id/process-payment', async (req, res) => {
  const { token, amount } = req.body;

  try {
    await stripe.charges.create({
      source: token.id,
      amount,
      currency: "CAD"
    });

    res.json({ status: 'Success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});


////////  REGISTER, LOGIN/LOGOUT & PROFILE  ///////////


app.post("/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json({ userDoc });
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passwordOK = bcrypt.compareSync(password, userDoc.password);
    if (passwordOK) {
      jsonWebToken.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("password is not ok");
    }
  } else {
    res.json("not found");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.get("/profile", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if (token) {
    jsonWebToken.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

////////  UPLOAD IMG-S  ///////////

//download images from the web to a local destination
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

// to store files locally
const photosMiddleware = multer({ dest: "uploads" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {

  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;

    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadedFiles);
});


////////  PLACES  ///////////

app.post("/places", (req, res) => {

  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  jsonWebToken.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    try {
      const placeDoc = await Place.create({
        owner: userData.id,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });


      res.json(placeDoc);
    } catch (error) {
      console.error("Error creating place:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put("/places/:id", async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;
  const {
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  jsonWebToken.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jsonWebToken.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/search-places", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is missing." });
    }

    const properties = await Place.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
      ],
    });

    res.json(properties);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get('/places', async (req, res) => {
  res.json(await Place.find());
});

////////  BOOKINGS  ///////////

//end points for index page

app.post("/bookings", async (req, res) => {

  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;
  Booking.create({
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
});


app.post('/bookings/:bookingId', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const {
    checkIn,
    checkOut,
    // place,
    // numberOfGuests,
    // name,
    // phone,
    // price,
  } = req.body;

  Booking.updateOne({ user: userData.id },
    {
      checkIn,
      checkOut,
      // place,
      // numberOfGuests,
      // name,
      // phone,
      // price,
      // user: userData.id,
    }).then((doc) => {
      res.json(doc);
    }).catch((err) => {
      throw err;
    });
});

app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

app.get('/bookings/:placeId', async (req, res) => {

  res.json(await Booking.find({ place: req.params.placeId }));
});

// Create a new review
app.post("/reviews", async (req, res) => {
  try {
    const { property, rating, comment } = req.body;
    let userData = null;


    try {
      userData = await getUserDataFromReq(req);
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized, no valid token provided" });
    }

    // Check if the user is authenticated
    if (!userData) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Use Review.create to directly create and save the review in the database
    const savedReview = await Review.create({
      user: userData.id,
      property: property,
      rating: rating,
      comment: comment,
    });

    // Respond with the saved review
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Get reviews for a specific property
app.get("/property/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Find all reviews for the specified property
    const reviews = await Review.find({ property: propertyId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    // Respond with the reviews
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userData = await getUserDataFromReq(req); // Your authentication logic to get user data

    // Validate user data and check if they are the owner of the review
    if (!userData) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Optional validation checks
    if (rating < 1 || rating > 5 || !comment.trim()) {
      return res.status(400).json({
        error: 'Invalid rating or comment'
      });
    }

    // Check if the user is the owner of the review
    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    if (existingReview.user.toString() !== userData.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Update the review in the database
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true } // Return the updated document
    );

    // Respond with the updated review
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a review
app.delete('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userData = await getUserDataFromReq(req); // Your authentication logic to get user data

    if (!userData) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Find the review to ensure it exists and to check ownership
    const reviewToDelete = await Review.findById(reviewId);
    if (!reviewToDelete) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if the user is the owner of the review or an admin
    if (reviewToDelete.user.toString() !== userData.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Delete the review from the database
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    // Respond with success message
    res.json({ message: 'Review successfully deleted', deletedReview });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid review ID format' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add this endpoint to handle deleting a booking by ID
app.delete('/bookings/:id', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const { id } = req.params;

  try {
    // Find the booking by ID and the user ID to ensure ownership
    const booking = await Booking.findOneAndDelete({ _id: id, user: userData.id });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

app.get("/test", (req, res) => {
  res.json("test ok");
});
