const express = require("express");
const router = express.Router();
const Place = require("../models/Place");
const jsonWebToken = require("jsonwebtoken");
const jwtSecret = "fnr;nva4o5awbew/cvae";

router.post("/", (req, res) => {
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

      res.json(placeDoc); // previous part run up to here
    } catch (error) {
      console.error("Error creating place:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

router.put("/:id", async (req, res) => {
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

router.get("/", async (req, res) => {
  
  res.json(await Place.find());
});



module.exports = router;
