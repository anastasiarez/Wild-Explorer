import React from "react";
import {useContext} from "react";
import { UserContext } from "../UserContext.jsx";

const Review = ({ review }) => {

  const { ready, user, setUser } = useContext(UserContext);

  console.log("reviewreview", review);
    const renderStarRating = () => {
        const rating = review.rating; // Assuming review.rating is a number between 1 and 5
        const maxRating = 5; // Maximum rating value

        // Create an array of stars based on the rating
        const stars = Array.from({ length: rating }, (_, index) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
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
