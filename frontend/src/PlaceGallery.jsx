import { useEffect, useState } from "react";

export default function PlaceGallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (showAllPhotos) {

    return (
      <div className="fixed inset-0 bg-white min-h-screen overflow-y-auto z-50">
      <div className="p-8 grid gap-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl">Photos of {place.title}</h2>
          <button
            onClick={() => setShowAllPhotos(false)}
            className="flex items-center gap-2 py-2 px-4 rounded-full shadow hover:bg-gray-200 focus:outline-none focus:ring focus:border-blue-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
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
        <div className="grid gap-4">
          {place?.photos?.length > 0 &&
            place.photos.map((photo, index) => (
              <img
                key={index}
                src={"http://localhost:4000/uploads/" + photo}
                alt={`Photo ${index + 1}`}
                className="w-full  h-auto rounded-lg"
              />
            ))}
        </div>
      </div>
    </div>
  )}

  return (

    <div className="relative">
      <div className=" pt - 15 grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
        <div>
          {place.photos?.[0] && (
            <div>
              <img onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover" src={'http://localhost:4000/uploads/' + place.photos[0]} alt="" />
            </div>
          )}
        </div>

        <div className="grid">
          {place.photos?.[1] && (
            <img onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover " src={'http://localhost:4000/uploads/' + place.photos[1]} alt="" />
          )}
          <div className="overflow-hidden">
            {place.photos?.[2] && (
              <img onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover relative top-2 " src={'http://localhost:4000/uploads/' + place.photos[2]} alt="" />
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowAllPhotos(true)}
        className="flex gap-1 absolute button-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-grey-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
        </svg>
        Show more photos
      </button>
    </div>
  );
}
