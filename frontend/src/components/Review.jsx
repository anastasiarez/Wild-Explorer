import React from "react";

const Review = ({ review }) => {
    const renderStarRating = () => {
        const rating = review.rating; // Assuming review.rating is a number between 1 and 5
        const maxRating = 5; // Maximum rating value

        // Create an array of stars based on the rating
        const stars = Array.from({ length: maxRating }, (_, index) => (
          <svg
            key={index}
            className={`star ${index < rating ? 'filled' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        ));

        return <div className="star-rating">{stars}</div>;
      };
  return (
    <div className="review">
      <div className="rating">{renderStarRating()}</div>
      <p className="comment">{review.comment}</p>
      <span className="author">{review.author}</span>
      <span className="date">
        {new Date(review.createdAt).toLocaleDateString()}
      </span>
      {user && user._id === review.user && (
        <div className="actions">
          <button onClick={() => onEdit(review._id)}>Edit</button>
          <button onClick={() => onDelete(review._id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Review;
