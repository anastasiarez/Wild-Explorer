// src/helpers/reviewsApi.js

const API_BASE_URL = 'http://localhost:4000';

export const getReviewsForProperty = async (propertyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${propertyId}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews from API:", error);
    throw error; // Re-throw the error so the calling function can handle it
  }
};