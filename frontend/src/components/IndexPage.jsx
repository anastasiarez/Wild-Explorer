import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Search from "../Search";

const IndexPage = ({searchResults, searchButtonClick}) => {
  const [places, setPlaces] = useState([]);



  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);






  return (
    <div>


      <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {searchResults.length > 0 ? (
          searchResults.map((result) => (
            <Link key={result._id} to={`/place/${result._id}`}>
              {/* Your item rendering code for search results goes here */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                <div className="aspect-w-3 aspect-h-2">
                  {result.photos?.[0] && (
                    <img
                      className="object-cover w-full h-full"
                      src={`http://localhost:4000/uploads/${result.photos?.[0]}`}
                      alt=""
                    />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{result.address}</h2>
                  <h3 className="text-sm text-gray-500 mb-2">{result.title}</h3>
                  <div className="flex flex-col items-center justify-between">
                    <span className="font-bold">${result.price}</span>
                    <span className="text-gray-500 text-sm">per night</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : searchButtonClick && (<p>no search result</p>)}
        {places.length > 0 && searchResults.length == 0?
        (

            places.map((place) => (
              <Link key={place._id} to={`/place/${place._id}`}>
                {/* Your item rendering code for places goes here */}
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                  <div className="aspect-w-3 aspect-h-2">
                    {place.photos?.[0] && (
                      <img
                        className="object-cover w-full h-full"
                        src={`http://localhost:4000/uploads/${place.photos?.[0]}`}
                        alt=""
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{place.address}</h2>
                    <h3 className="text-sm text-gray-500 mb-2">{place.title}</h3>
                    <div className="flex flex-col items-center justify-between">
                      <span className="font-bold">${place.price}</span>
                      <span className="text-gray-500 text-sm">per night</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ):searchResults == 0 && (<p>no properties available</p>)}
      </div>
    </div>
  );
};

export default IndexPage;
