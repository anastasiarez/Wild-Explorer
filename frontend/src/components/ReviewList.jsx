import React, { useState, useEffect, useContext } from 'react';
import Review from './Review';
import { getReviewsForProperty } from '../helpers/reviewsApi';
import { useParams } from 'react-router-dom';
import ReviewForm from './ReviewForm';
import { UserContext } from '../UserContext';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: propertyId } = useParams();
  const { user } = useContext(UserContext);

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

      {user ? <ReviewForm propertyId={propertyId} onReviewSubmit={handleReviewSubmit} /> : null}
      {reviews.length === 0 ? (
        <p>No reviews available for this property.</p>
      ) : (
        reviews.map((review) => <Review key={review._id} review={review} />)
      )}

    </div>
  );
};

export default ReviewList;


