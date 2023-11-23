import React, { useState } from 'react';
import { submittedReview } from '../helpers/reviewsApi'; // Import your API function for submitting reviews

const ReviewForm = ({ propertyId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Review submitted successfully:');

    try {
      // Call your API function to submit the review
      await submittedReview(propertyId, rating, comment);

      // Notify the parent component (ReviewList) that a new review has been submitted
      onReviewSubmit();


      setRating(0);
      setComment('');
    } catch (error) {

      console.error('Error submitting review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rating:
        <input type="number" min="1" max="5" value={rating} onChange={handleRatingChange} />
      </label>
      <br />
      <label>
        Comment:
        <textarea value={comment} onChange={handleCommentChange} />
      </label>
      <br />
      <button className='primary mt-4' type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
