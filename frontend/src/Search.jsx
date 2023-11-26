import React from "react";
import { useState } from "react";

import "react-datepicker/dist/react-datepicker.css";

console.log('Search Component Rendered');

const Search = ({ onSearch, setSearchResults, setSearchButtonClick }) => {
  const [wordSearch, setWordSearch] = useState("");

  const handleSearchInput = (event) => {
    const newWordSearch = event.target.value;
    setWordSearch(newWordSearch);
    console.log('Search input updated:', newWordSearch);
  };

  const handleSearchSubmit = async () => {
    setSearchButtonClick(true);
    try {
      const searchTerm = `query=${encodeURIComponent(wordSearch)}`;
      const response = await fetch(`/search-places?${searchTerm}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setSearchResults(data);

      if (typeof onSearch === 'function') {
        onSearch(data);
      }

      if (data.length === 0) {
        setWordSearch("");
      }

    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <input
          className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:border-primary"
          placeholder="Search for places"
          value={wordSearch}
          onChange={handleSearchInput}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div>
        <button
          type="button"
          className="bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-80 focus:outline-none"
          onClick={handleSearchSubmit}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;
