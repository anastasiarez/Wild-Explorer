const express = require("express");
const router = express.Router();
const Place = require("../models/Place");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const jwtSecret = "fnr;nva4o5awbew/cvae";

router.get("/search-places", async (req, res) => {
  console.log("We are here", req.query);
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

router.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jsonWebToken.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

module.exports = router;
