import React, { useState, useEffect } from 'react';
import Review from './Review';
import { getReviewsForProperty } from '../helpers/reviewsApi';
import { useParams } from 'react-router-dom';
import ReviewForm from './ReviewForm';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: propertyId } = useParams();

  // Define fetchReviews outside useEffect
  const fetchReviews = async () => {
    try {
      const fetchedReviews = await getReviewsForProperty(propertyId);
      setReviews(fetchedReviews);
      setLoading(false);
    } catch (error) {
      setError('Error fetching reviews.');
    }
  };

  useEffect(() => {
    // Call fetchReviews when the component mounts and when propertyId changes
    fetchReviews();
  }, [propertyId]);

  const handleReviewSubmit = () => {
    // Refetch reviews when a new review is submitted
    fetchReviews();
  };

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="review-list">
      
      <ReviewForm propertyId={propertyId} onReviewSubmit={handleReviewSubmit} />
      {reviews.length === 0 ? (
        <p>No reviews available for this property.</p>
      ) : (
        reviews.map((review) => <Review key={review._id} review={review} />)
      )}
    </div>
  );
};

export default ReviewList;


