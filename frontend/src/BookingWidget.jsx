import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

const isPhoneNumberValid = (phoneNumber) => /^\d{10}$/.test(phoneNumber);

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('1');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookThisPlace() {
    const response = await axios.post('/bookings', {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      place: place._id,
      price: numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const isFormValid = () => {
    return (
      checkIn !== '' &&
      checkOut !== '' &&
      numberOfGuests !== '' &&
      name !== '' &&
      isPhoneNumberValid(phone)
    );
  };

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">

        Price: ${place.price} / per night
      </div>

      <div className="border rounded-2xl mt-8">
        <div className="flex">
          <div className=" py-3 px-4">
            <label>Check-In: </label>
            <input
              type="date"
              value={checkIn}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div className=" py-5 px-5 border-l">
            <label>Check-Out: </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <div className="py-3 px-4 border-t">
          <label>Number of guests: </label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
          />
        </div>

        <div className="py-3 px-3 border-t">
          <label>Your full name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="py-3 px-3 border-t">
          <label>Phone Number: </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              const newPhone = e.target.value;
              if (/^\d*$/.test(newPhone) || newPhone === "") {
                setPhone(newPhone);
              }
            }}
            onBlur={() =>
              !isPhoneNumberValid(phone) && phone !== "" && setPhone("")
            }
          />
          {!isPhoneNumberValid(phone) && phone !== "" && (
            <p>
              Please enter a 10-digit phone number
            </p>
          )}
        </div>

        <button
          onClick={bookThisPlace}
          className={`primary mt-4 ${isFormValid() ? '' : 'disabled'}`}
          disabled={!isFormValid()}
          style={!isFormValid() ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
        >
          Book this place
          {numberOfNights > 0 && <span> ${numberOfNights * place.price}</span>}
        </button>
      </div>
    </div>
  );
}
