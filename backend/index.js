const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);
const jsonWebToken = require('jsonwebtoken');
const jwtSecret = 'fnr;nva4o5awbew/cvae';
const cookieParser = require('cookie-parser');
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

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

app.post('/login', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passwordOK = bcrypt.compareSync(password, userDoc.password);
    if (passwordOK) {
      jsonWebToken.sign({
        email: userDoc.email,
        id: userDoc._id,
        //user_name: userDoc.user_name
      }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('password is not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/profile', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if (token) {
    jsonWebToken.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({name, email, _id});
    });
  } else {
    res.json(null);
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

app.get("/test", (req, res) => {
  res.json("test ok");
});
