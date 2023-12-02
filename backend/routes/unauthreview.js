const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Get reviews for a specific property
router.get("/property/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params;
    console.log("GET request to /reviews/property/:propertyId", req.params);

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

module.exports = router;
