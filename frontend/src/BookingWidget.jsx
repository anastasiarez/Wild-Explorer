import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays, eachDayOfInterval, addDays } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const bookingAlert = withReactContent(Swal);

export function excludeSingleDate(bookedDates) {
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

export function removeDuplicates(dates) {
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

  const stripePublicKey = 'pk_test_51O3kBxGTAB6CtxdhKOcpMUBtDiJc0XCrsWoEOB2BKBqxxszz8XsU0PwykGvtZsezvFeFyd1bXyYDmlscVNqAFh6G00ZedrV42z';

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

  const handleSuccess = () => {
    bookingAlert.fire({
      icon: 'success',
      title: 'Payment was successful',
    });
  };
  const handleFailure = () => {
    bookingAlert.fire({
      icon: 'error',
      title: 'Payment was not successful',
    });
  };

  async function bookThisPlace() {

    if (!user) {
      alert('Please log in to book this place');
      navigate('/login');
      return;
    }

    if (parseInt(numberOfGuests, 10) > maxGuests) {
      return;
    }

    if (numberOfNights < 2) {
      setErrorMessage("Minimum booking duration is two nights.");
      return;
    }

    try {
      const response = await axios.post('/bookings', {
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        place: place._id,
        price: numberOfNights * place.price,
      });

      if (response.status === 200) {
        handleSuccess();
      }

      const newBookingId = response.data._id;

      setBookingSuccess(true);
      setBookingId(newBookingId);

      setTimeout(() => {
        navigate(`/account/bookings/`);
      }, 1000);

    }
    catch (error) {
      console.error("Failed to book:", error);
      handleFailure();
      setErrorMessage("Please register or loging");
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
                const nights = differenceInCalendarDays(new Date(checkOut), date);

                if (nights < 2) {
                  setErrorMessage("Minimum booking duration is two nights.");

                } else {
                  setErrorMessage(null);
                }
              }}
              minDate={addDays(new Date, 1)}
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
                const nights = differenceInCalendarDays(date, new Date(checkIn));
                if (nights < 2) {
                  setErrorMessage("Minimum booking duration is two nights.");

                } else {
                  setErrorMessage(null);
                }
              }}
              minDate={checkIn || addDays(new Date, 1)}
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

        <StripeCheckout
          onClick={bookThisPlace}
          className={`primary mt-4 mb-4 ${isFormValid() ? '' : 'disabled'}`}
          disabled={!isFormValid() || numberOfNights < 2 || !user}
          style={!isFormValid() ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
          stripeKey={stripePublicKey}
          label={"Book for $" + (numberOfNights * place.price)}
          name="Pay With Credit Card"
          amount={numberOfNights * place.price * 100}
          description={`Your total is $${numberOfNights * place.price}`}
          token={bookThisPlace}
        />

        {parseInt(numberOfGuests, 10) > maxGuests && (
          <div className="text-red-500 mt-2">
            Number of guests exceeds the maximum allowed ({maxGuests} guests).
          </div>
        )}
        {bookingSuccess ? (
          <div className="text-green-500 mt-2">
            Success! You are going to travel now!
          </div>
        ) : null}

        {!user && (
          <div className="text-red-500 mt-2">
             <Link to="/login" className="text-blue-500"> Please Register or Login</Link>
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