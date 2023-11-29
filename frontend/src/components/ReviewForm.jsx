import React, { useState } from 'react';
import { submittedReview } from '../helpers/reviewsApi';

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
      await submittedReview(propertyId, rating, comment);
      onReviewSubmit();

      setRating(0);
      setComment('');
    } catch (error) {

      console.error('Error submitting review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mb-5'>
      <label>
        Give this place a rating:
        <input type="number" min="1" max="5" value={rating} onChange={handleRatingChange} />
      </label>
      <br />
      <label>
        Your thoughts about this place:
        <textarea value={comment} onChange={handleCommentChange} />
      </label>
      <br />
      <button className='primary mt-4' type="submit">Submit Your Review</button>
    </form>
  );
};

export default ReviewForm;
