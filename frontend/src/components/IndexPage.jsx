import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const IndexPage = ({ searchResults, searchButtonClick }) => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/public/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  return (
    <div >
      {searchResults.length > 0 ? (
        <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {searchResults.map((result) => (
            <Link key={result._id} to={`/place/${result._id}`}>
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
                  <h2 className="text-l text-gray-500 mb-2">{result.title}</h2>
                  <h3 className="text-m font-semibold mb-2">{result.address}</h3>
                  <div className="flex flex-col items-center justify-between">
                    <span className="font-bold">${result.price}</span>
                    <span className="text-gray-500 text-sm">per night</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : searchButtonClick && (
        <div className="text-center text-orange-500 mt-4 mb-20 font-bold text-xl pb-2 border-b-2 border-gray-300">
          <p className="mb-5"> No search result found. Please browse our other places</p>
        </div>
      )}

      <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        {places.length > 0 && searchResults.length === 0 ? (
          places.map((place) => (
            <Link key={place._id} to={`/place/${place._id}`}>
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:bg-[#d9e7cb] transition duration-300 ease-in-out transform hover:scale-105">
                <div className="aspect-w-3 aspect-h-2">
                  {place.photos?.[0] && (
                    <img
                      className="object-cover w-225 h-225"
                      src={`http://localhost:4000/uploads/${place.photos?.[0]}`}
                      alt=""
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {place.title}
                  </h3>
                  <h2 className="text-m text-gray-600 mb-2">
                    {place.address}
                  </h2>
                  <div className="flex flex-col items-center justify-between">
                    <span className="font-bold">${place.price}</span>
                    <span className="text-gray-500 text-sm">per night</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : searchResults.length === 0 && (
          <p className="text-center text-black-500 mt-4 font-bold text-xl">
            No properties available.
          </p>
        )}
      </div>
    </div>
  );
};

export default IndexPage;
