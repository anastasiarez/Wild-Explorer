// src/helpers/reviewsApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

export const getReviewsForProperty = async (propertyId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reviews/property/${propertyId}`
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews from API:", error);
    throw error; // Re-throw the error so the calling function can handle it
  }
};

export const submittedReview = async (property, rating, comment) => {
  try {
    await axios.post(`/reviews`, {
      property,
      rating,
      comment,
    });
  } catch (error) {
    throw new Error("Error submitting the review.");
  }
};
