import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import Search from "../Search";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";
import ReviewList from "./ReviewList";
import Perks from "../Perks";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  console.log("I am in placepage", place);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/public/places/${id}`).then(response => {
      setPlace(response.data);
    });
  }, [id]);

  const handleSearch = async (searchResults) => {
    setFilteredPlaces(searchResults);
  };

  if (!place) return "";

  const propertyId = id || place?._id;

  if (filteredPlaces.length > 0) {

    <Search onSearch={handleSearch} />;
  }

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-white min-h-screen">
        <div className="p-8 grid gap-4">
          <div>
            <h2 className="text-3xl mr-36">Photos of {place.title}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed right-12 top-8 flex gap-2 py-2 px-4 rounded-2xl shadow shadow-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close photos
            </button>
          </div>
          {place?.photos?.length > 0 &&
            place.photos.map((photo) => (
              <div>
                <img
                  src={"http://localhost:4000/uploads/" + photo}
                  alt=""
                ></img>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-gray-100 px-8 py-8 rounded-2xl">
      <h1 className="text-3xl mb-4">{place.title}</h1>

      <div className="mb-4">
        <AddressLink style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#333" }}>
          {place.address}
        </AddressLink>
      </div>

      <PlaceGallery place={place} />

      <div className="mt-12 mb-20 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl mb-5">Description</h2>
            <p className="text-gray-700">{place.description}</p>
          </div>

          <h2 className="font-semibold text-2xl mt-10 mb-5">Perks</h2>
          <div className="grid mt-2 mb-10 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <Perks selected={place.perks} />
          </div>

          <p className="text-gray-700 mb-20">
            Check-In: {place.checkIn} <br />
            Check-out: {place.checkOut} <br />
            Max number of guests: {place.maxGuests}
          </p>

        </div>

        <div>
          <BookingWidget place={place} />
        </div>
      </div>

      <div className="bg-white -mx-8 py-8 border-t">
        <h2 className="font-semibold text-2xl mb-5">Extra info & Rules</h2>
        <div className="mb-20">
          <p className="text-gray-700">{place.extraInfo}</p>
        </div>

        <div className="reviews-section text-xl mb-5">
          <ReviewList propertyId={propertyId || place._id} />
        </div>
      </div>
    </div>
  );
}
