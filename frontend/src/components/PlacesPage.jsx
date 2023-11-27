import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import axios from "axios";

const PlacesPage = () => {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get("/user-places").then(({ data }) => {
            setPlaces(data);
        });
    }, [axios]);


    return (
        <div>
            <AccountNav />

            <div className="text-center mt-6">
                <Link
                    className="inline-flex items-center gap-1 bg-primary text-white py-2 px-6 rounded-full"
                    to="/account/places/new"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    Add new place
                </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.length === 0 ? (
                    <p>...You don't have listings yet</p>
                ) : (
                    places.map((place) => (
                        <Link
                            key={place._id}
                            to={{ pathname: "/account/places/" + place._id }}
                            className="flex flex-col overflow-hidden bg-white rounded-lg shadow-lg transition transform hover:scale-105"
                        >
                            <div className="w-full h-40 overflow-hidden">
                                {place.photos.length > 0 && (
                                    <img
                                        className="w-full h-full object-cover"
                                        src={"http://localhost:4000/uploads/" + place.photos[0]}
                                        alt=""
                                    />
                                )}
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{place.title}</h2>
                                <p className="text-gray-700 text-sm leading-snug mb-4">
                                    {place.description}
                                </p>
                                <p className="text-gray-700 text-sm leading-snug mb-4">
                                    {place.perks.join(", ")}
                                </p>
                                <p className="text-gray-700 text-sm leading-snug mb-4">
                                    ${place.price}
                                </p>
                                
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};


export default PlacesPage;