const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const jsonWebToken = require("jsonwebtoken");
const jwtSecret = "fnr;nva4o5awbew/cvae";

router.post("/", async (req, res) => {
  try {
    const { property, rating, comment } = req.body;
    // let userData = null;
    const userData = res.locals.userData;
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

router.patch("/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const userData = res.locals.userData;
    if (rating < 1 || rating > 5 || !comment.trim()) {
      return res.status(400).json({
        error: "Invalid rating or comment",
      });
    }

    // Check if the user is the owner of the review
    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    if (existingReview.user.toString() !== userData.userId) {
      return res.status(403).json({ error: "Forbidden" });
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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a review
router.delete("/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    //const userData = await getUserDataFromReq(req); // Your authentication logic to get user data
    const userData = res.locals.userData;
    const reviewToDelete = await Review.findById(reviewId);
    if (!reviewToDelete) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if the user is the owner of the review or an admin
    if (reviewToDelete.user.toString() !== userData.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Delete the review from the database
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    // Respond with success message
    res.json({ message: "Review successfully deleted", deletedReview });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid review ID format" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
