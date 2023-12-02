const express = require("express");
const router = express.Router();
const User = require("../models/User");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bcryptSalt = bcrypt.genSaltSync(10);
const jsonWebToken = require("jsonwebtoken");
const jwtSecret = "fnr;nva4o5awbew/cvae";

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
