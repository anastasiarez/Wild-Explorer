import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import Search from "../Search";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then(response => {
      setPlace(response.data);
    });
  }, [id]);

  const handleSearch = async (searchResults) => {
    setFilteredPlaces(searchResults);
  };

  if (!place) return '';

  if (filteredPlaces.length > 0) {
    <Search onSearch={handleSearch} />;
  }

  if (showAllPhotos) {

    return (
      <div className="absolute inset-0 bg-white min-h-screen" >
        <div className="p-8 grid gap-4">
          <div>
            <h2 className="text-3xl mr-36">Photos of {place.title}</h2>

            <button onClick={() => setShowAllPhotos(false)} className="fixed right-12 top-8 flex gap-2 py-2 px-4 rounded-2xl shadow shadow-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close photos
            </button>
          </div>

          {place?.photos?.length > 0 && place.photos.map(photo => (
            <div>
              <img src={'http://localhost:4000/uploads/' + photo} alt=""></img>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>

      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />
      <div className="mt-12 mb-20 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>

          Check-In Time: {place.checkIn} <br />
          Check-out Time: {place.checkOut} <br />
          Max number of guests: {place.maxGuests}
        </div>

        <div>
          <BookingWidget place={place} />
        </div>
      </div>

      <div className="bg-white -mx-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra Info</h2>
        </div>
        <div
          className="mb-4 mt-2 text-sm gray-gray-700 leading-5"> {place.extraInfo}
        </div>
      </div>
    </div>
  );
}

