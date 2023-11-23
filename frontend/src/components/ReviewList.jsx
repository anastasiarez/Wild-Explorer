import React, { useState, useEffect } from 'react';
import Review from './Review';
// import { getReviewsForProperty } from '../api'; // Import the API function to fetch reviews

const ReviewList = ({ propertyId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewsForProperty(propertyId);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [propertyId]);

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="review-list">
      {reviews.length === 0 ? (
        <p>No reviews available for this property.</p>
      ) : (
        reviews.map((review) => <Review key={review._id} review={review} />)
      )}
    </div>
  );
};

export default ReviewList;