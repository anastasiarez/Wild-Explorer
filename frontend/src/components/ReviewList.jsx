import React, { useState, useEffect } from 'react';
import Review from './Review';
import { getReviewsForProperty } from '../helpers/reviewsApi';
import { useParams } from 'react-router-dom';



const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: propertyId } = useParams();

  useEffect(() => {
    // Fetch reviews when `propertyId` changes
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getReviewsForProperty(propertyId);
        setReviews(fetchedReviews);
        // (handle setting loading and error state)
      } catch (error) {
        // (handle the error)
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