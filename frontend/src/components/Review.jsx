import React from "react";
import { useContext } from "react";
import { UserContext } from "../UserContext.jsx";

const Review = ({ review }) => {

  const { ready, user, setUser } = useContext(UserContext);

  const renderStarRating = () => {
    const rating = review.rating;
    const maxRating = 5;

    const stars = Array.from({ length: maxRating }, (_, index) => (
      <svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        fill={index < rating ? "yellow" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="orange"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    ));

     return <div className="flex">{stars}</div>;
  };

  return (
    <div className="border p-4 mb-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <div className="flex items-center mb-2">{renderStarRating()}</div>
        </div>
        <div className="col-span-1">
          <p className="mb-2">{review.comment}</p>
          <span className="block text-sm text-gray-600">{review.author}</span>
          <span className="block text-sm text-gray-600">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        {/* {user && user._id === review.user && (
          <div className="col-span-1">
            <div className="space-x-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => onEdit(review._id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => onDelete(review._id)}
              >
                Delete
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Review;
