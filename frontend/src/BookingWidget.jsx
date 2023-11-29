import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays, eachDayOfInterval, isWithinInterval } from "date-fns";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function excludeSingleDate(bookedDates) {
  const missingDates = [];

  for (let i = 0; i < bookedDates.length - 1; i++) {
    const currentDate = (bookedDates[i]);
    const nextDate = (bookedDates[i + 1]);

    const interval = eachDayOfInterval({ start: currentDate, end: nextDate });

    if (interval.length > 1) {
      const missingDatesInInterval = interval.slice(1, -1);
      missingDates.push(...missingDatesInInterval);
    }
  }
  return [...missingDates, ...bookedDates];

}

function removeDuplicates(dates) {
  return [...new Set(dates.map(date => date.getTime()))].map(date => new Date(date)).sort((a, b) => a.getTime() - b.getTime());
}


export default function BookingWidget({ place }) {

  const { user } = useContext(UserContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState('1');
  const [bookedDates, setBookedDates] = useState([]);
  const [maxGuests, setMaxGuests] = useState(1);
  const [bookingId, setBookingId] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  //const [redirect, setRedirect] = useState('');

  useEffect(() => {
    axios.get(`/bookings/${place._id}`).then(response => {
      const result = [];
      for (const { checkIn, checkOut } of response.data) {
        const bookingPeriod = eachDayOfInterval({
          start: new Date(checkIn),
          end: new Date(checkOut)
        });
        result.push(...bookingPeriod);

      }
      setBookedDates(excludeSingleDate(removeDuplicates(result)));

    });
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    setMaxGuests(place.maxGuests);
  }, [place]);

  let numberOfNights = 0;

  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookThisPlace() {
    if (parseInt(numberOfGuests, 10) > maxGuests) {
      return;
    }

    try {
      if (numberOfNights < 2) {
        setErrorMessage("Minimum booking duration is two nights.");
        return;
      }

      const response = await axios.post('/bookings', {
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        place: place._id,
        price: numberOfNights * place.price,
      });

      const newBookingId = response.data._id;

      setBookingSuccess(true);
      setBookingId(newBookingId);

      setTimeout(() => {
        navigate(`/account/bookings/`);
      }, 1000);


    }
    catch (error) {
      console.error("Failed to book:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  const isPhoneNumberValid = (phoneNumber) => /^\d{10}$/.test(phoneNumber);

  const isFormValid = () => {
    return (
      checkIn !== null &&
      checkOut !== null &&
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
          <div className="py-5 px-5 border-l">

            <label>Check-In: </label>
            <ReactDatePicker
              selected={checkIn}
              onChange={date => {
                setCheckIn(date);
                setErrorMessage(null);
              }}
              minDate={new Date()}
              excludeDates={bookedDates}
              dateFormat="yyyy/MM/dd"
            />
          </div>
          <div className="py-5 px-5 border-l">

            <label>Check-Out: </label>
            <ReactDatePicker
              selected={checkOut}
              onChange={date => {
                setCheckOut(date);
                setErrorMessage(null);
              }}
              minDate={checkIn || new Date()}
              excludeDates={bookedDates}
              dateFormat="yyyy/MM/dd"
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

          <label>Phone number: </label>
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
            <p>Please enter a 10-digit phone number</p>
          )}
        </div>

        <button
          onClick={bookThisPlace}
          className={`primary mt-4 mb-4 ${isFormValid() ? '' : 'disabled'}`}
          disabled={!isFormValid()}
          style={!isFormValid() ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
        >
          Book for
          {numberOfNights > 0 && <span> ${numberOfNights * place.price}</span>}
        </button>


        {parseInt(numberOfGuests, 10) > maxGuests && (
          <div className="text-red-500 mt-2">
            Number of guests exceeds the maximum allowed ({maxGuests} guests).
          </div>
        )}
        {bookingSuccess && (
          <div className="text-green-500 mt-2">
            Success! You are going to travel now!
          </div>
        )}
        {errorMessage && (
          <div className="text-red-500 mt-2">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
