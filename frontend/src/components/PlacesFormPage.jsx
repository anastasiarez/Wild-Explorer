import React, { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import PhotoUploader from "../PhotoUploader";
import Perks from "../Perks";
import axios from "axios";

const PlacesFormPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [redirectToPlacesList, setRedirectToPlacesList] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);
  const [formErrors, setFormErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!title.trim()) {
      errors.title = "Please enter the title.";
      isValid = false;
    }
    if (title.length < 3) {
      errors.titleLength = "Title should have more than three characters.";
      isValid = false;
    }

    if (maxGuests <= 0) {
      errors.maxGuests = "Please enter a valid number of guests.";
      isValid = false;
    }

    if (price <= 0) {
      errors.price = "Please enter a valid price.";
      isValid = false;
    }

    // Update the formErrors state
    setFormErrors(errors);
    return isValid;
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    let newErrors = { ...formErrors };

    if (!newTitle.trim()) {
      newErrors.title = "Please enter the title.";
    } else if (newTitle.length < 3) {
      newErrors.titleLength = "Title should have more than three characters.";
    } else {
      delete newErrors.title;
      delete newErrors.titleLength;
    }

    setFormErrors(newErrors);
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn ? data.checkIn : "");
      setCheckOut(data.checkOut ? data.checkOut : "");
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  const inputHeader = (text) => <h2 className="text-xl mt-4">{text}</h2>;

  const inputDescription = (text) => (
    <p className="text-gray-500 text-sm mt-1 mb-4">{text}</p>
  );

  const inputValue = (
    header,
    description,
    inputField,
    errors,
    submitAttempted
  ) => (
    <div className="mb-6">
      {inputHeader(header)}
      {inputDescription(description)}
      {inputField}
      {submitAttempted &&
        errors &&
        errors.map(
          (error, index) =>
            error && (
              <div className="text-red-500" key={index}>
                {error}
              </div>
            )
        )}
    </div>
  );

  const SavePlace = async (e) => {
    e.preventDefault();
    //const isValid = Object.keys(formErrors).length === 0;
    setSubmitAttempted(true);
    const isValid = validateForm();

    const data = {
      title,
      address,
      description,
      addedPhotos,
      perks,
      checkIn,
      checkOut,
      extraInfo,
      maxGuests,
      price,
    };
    if (!isValid) {
      console.log("Form is not valid. Please review the errors:", formErrors);
      return; // Don't proceed if the form is invalid
    }

    if (id) {
      await axios.put(`/places/${id}`, data);
    } else {
      await axios.post("/places", data);
    }

    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={SavePlace} className="max-w-3xl mx-auto mt-8">
        {inputValue(
          "Title",
          "",
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Title, e.g., My Lovely Apartment"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary"
          />,
          [formErrors.title || null, formErrors.titleLength || null],
          submitAttempted
        )}

        {inputValue(
          "Address",
          "",
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary"
          />,
          [],
          submitAttempted
        )}

        {inputValue(
          "Photo",
          "",
          <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />,
          [],
          submitAttempted
        )}

        {inputValue(
          "Description",
          "",
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary"
          />,
          [],
          submitAttempted
        )}

        {inputValue(
          "Perks",
          "",
          <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <Perks selected={perks} onChange={setPerks} />
          </div>,
          [],
          submitAttempted
        )}

        {inputValue(
          "Extra info & Rules",
          "",
          <textarea
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
            placeholder="Extra info & Rules"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary"
          />,
          [],
          submitAttempted
        )}

        {inputValue(
          "Check-in & Check-out Time",
          "",
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mt-2 -mb-1">Check-in time</h3>
              <input
                type="text"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="12"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Check-out time</h3>
              <input
                type="text"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="11"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Max number of guests</h3>
              <input
                type="number"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary"
              />
            </div>
          </div>,
          [],
          submitAttempted
        )}

        {inputValue(
          "Price per night",
          "",
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary"
            />
          </div>,
          [],
          submitAttempted
        )}

        <div className="mt-8">
          <button className="bg-secondary px-8 py-3 rounded-full text-white hover:bg-opacity-80 focus:outline-none">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlacesFormPage;
