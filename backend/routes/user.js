const express = require('express')
const router = express.Router()
const User = require("../models/User");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const bcryptSalt = bcrypt.genSaltSync(10);
const jsonWebToken = require("jsonwebtoken");
const jwtSecret = "fnr;nva4o5awbew/cvae";




router.post("/register", async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { name, email, password } = req.body;
    console.log("name, email, password", req.body);

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

  router.post("/login", async (req, res) => {
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

  router.post("/logout", (req, res) => {
    res.cookie("token", "").json(true);
  });

  router.get("/profile", (req, res) => {
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

  module.exports = router;