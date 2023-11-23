const mongoose = require('mongoose');
const {Schema } = mongoose;

const reviewSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating value
    max: 5, // Maximum rating value
  },
  comment: { type: String, required: true },
  // Timestamps automatically create 'createdAt' and 'updatedAt' fields
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;