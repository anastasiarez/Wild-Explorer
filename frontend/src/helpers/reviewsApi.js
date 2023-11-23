// src/helpers/reviewsApi.js

const API_BASE_URL = 'http://localhost:4000';

export const getReviewsForProperty = async (propertyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/property/${propertyId}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews from API:", error);
    throw error; // Re-throw the error so the calling function can handle it
  }
};

export const submittedReview = async (propertyId, rating, comment) => {
  try {


    await axios.post(`${API_BASE_URL}/reviews`, {
      propertyId,
      rating,
      comment,
    });
  } catch (error) {
    throw new Error('Error submitting the review.');
  }
};