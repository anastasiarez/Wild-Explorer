import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactDatePicker from "react-datepicker";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import { eachDayOfInterval, isWithinInterval, differenceInCalendarDays, addDays } from "date-fns";
import BookingDates from "../BookingDates";
import { excludeSingleDate, removeDuplicates } from "../BookingWidget";


export default function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [bookedDates, setBookedDates] = useState([]);
  const [maxGuests, setMaxGuests] = useState(1);
  const [booking, setBooking] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleCancelBooking = () => {
    if (booking && booking._id) {
      axios.delete(`/bookings/${booking._id}`)
        .then(() => {

          console.log("Booking cancelled successfully");

          setBooking(null);
          alert('Booking has been cancelled');; // Set the message here
          navigate("/account/bookings/");


        })
        .catch(error => {
          console.error("Error cancelling booking:", error);
          alert('Failed to cancel booking'); // Set an error message if cancellation fails

        });
    }
  };

  useEffect(() => {
    if (booking) {
      setCheckIn(booking.checkIn);
      setCheckOut(booking.checkOut);
      setNumberOfGuests(booking.numberOfGuests);
      setName(booking.name);
      setPhone(booking.phone);

      axios.get(`/bookings/${booking.place._id}`).then((response) => {

        const result = [];
        for (const { checkIn, checkOut } of response.data) {
          const placeBookingPeriod = eachDayOfInterval({
            start: new Date(checkIn),
            end: new Date(checkOut),
          });
          result.push(...placeBookingPeriod);
        }
        const excludeUserDates = result.filter((date) => {
          return !isWithinInterval(date, {
            start: new Date(booking.checkIn),
            end: new Date(booking.checkOut),
          });
        });

        setBookedDates(excludeSingleDate(removeDuplicates(excludeUserDates)));

        //setBookedDates(excludeUserDates);
        setMaxGuests(booking.place.maxGuests);
      });
    }
  }, [booking]);

  useEffect(() => {
    if (id) {
      axios.get('/bookings').then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  // const numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));

  const numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  async function editBooking() {
    if (numberOfGuests > maxGuests) {
      console.error("Number of guests exceeds the maximum allowed.");
      return;
    }
    if (numberOfNights < 2) {
      setErrorMessage("Minimum booking duration is two nights.");
      return;
    }

    try {
      await axios.post(`/bookings/${id}`, {
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
      });
      setSuccessMessage("Success! Your booking is updated!");

    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  }

  if (!booking || !booking.place) {
    return "";
  }

  const isPhoneNumberValid = (phoneNumber) => /^\d{10}$/.test(phoneNumber);

  const isFormValid = () => {
    return (
      checkIn !== "" &&
      checkOut !== "" &&
      numberOfGuests !== "" &&
      name !== "" &&
      isPhoneNumberValid(phone)
    );
  };


  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <h1 className="text-3xl text-center">{booking.place.title}</h1>

      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-center mb-10">Your booking information:</h2>

          <BookingDates booking={booking} className="ml-5 mb-4 mt-4 text-gray-700 flex gap-3 " />

          <div className="text-l">
            <div className="flex items-center justify-between mb-10">
              <div className="py-4 px-4">
                <label>Check-in: </label>
                <ReactDatePicker
                  excludeDates={bookedDates}
                  selected={new Date(checkIn)}
                  onSelect={(date) => setCheckIn(date)}
                  onChange={date => {
                    setCheckIn(date);
                    setErrorMessage(null);
                  }}
                  minDate={addDays(new Date, 1)}

                />
              </div>

              <div className="py-4 px-4">

                <label>Check-out: </label>
                <ReactDatePicker
                  excludeDates={bookedDates}
                  selected={new Date(checkOut)}
                  onSelect={(date) => setCheckOut(date)}
                  onChange={date => {
                    setCheckOut(date);
                    setErrorMessage(null);
                  }}
                  minDate={checkIn || addDays(new Date, 1)}
                />
              </div>

              <div className="py-3 px-4">
                <label>Number of guests: </label>
                <input
                  type="number"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                />
              </div>

              <div className="py-3 px-4">
                <label>Name: </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="py-3 px-4">
                <label>Phone number: </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() =>
                    !/^\d{10}$/.test(phone) && phone !== "" && setPhone("")
                  }
                />
                {!/^\d{10}$/.test(phone) && phone !== "" && (
                  <p className="text-red-500 mt-2">Please enter a 10-digit phone number</p>
                )}
              </div>

              {successMessage && (
                <div className="text-green-500 mt-2">{successMessage}</div>
              )}

              {errorMessage && (
                <div className="text-red-500 mt-2">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={editBooking}
                className={`primary mt-4 ${isFormValid() ? "" : "disabled"}`}
                disabled={!isFormValid() || numberOfGuests > maxGuests}
                style={
                  !isFormValid() || numberOfGuests > maxGuests
                    ? { cursor: "not-allowed", opacity: 0.6 }
                    : {}
                }

              >
                Update Booking
              </button>

              {numberOfGuests > maxGuests && (
                <div className="text-red-500 mt-2">
                  Number of guests exceeds the maximum allowed ({maxGuests} guests).
                </div>
              )}
            </div>
          </div>
          <PlaceGallery place={booking.place} />

          <button onClick={handleCancelBooking} className="mt-10 mb-5 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}  