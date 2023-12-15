import React from "react";
import { useState } from "react";

const Search = ({ onSearch, setSearchResults, setSearchHitEnter }) => {
  const [wordSearch, setWordSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearchInput = (event) => {
    const newWordSearch = event.target.value;
    setWordSearch(newWordSearch);
  };

  const handleSearchSubmit = async () => {
    setSearching(true);
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
    } finally {
      setSearching(false);
      setSearchHitEnter(true);
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
          className="w-full md:w-96 px-4 py-2 border border-black rounded-full focus:outline-none focus:border-primary text-center"
          placeholder="Search for your next adventure"
          value={wordSearch}
          onChange={handleSearchInput}
          onKeyPress={handleKeyPress}
        />
      </div>
      
    </div>
  );
};

export default Search;