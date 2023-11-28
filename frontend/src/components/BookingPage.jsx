import {useParams,Navigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";


export default function BookingPage() {
    const {id} = useParams();
    const [booking,setBooking] = useState(null);
    const [message, setMessage] = useState('');

    const [redirect, setRedirect] = useState(false);


    useEffect(() => {
      if (id) {
        axios.get('/bookings').then(response => {
          const foundBooking = response.data.find(({_id}) => _id === id);
          if (foundBooking) {
            setBooking(foundBooking);
          }
        });
      }
    }, [id]);

    const handleCancelBooking = () => {
        if (booking && booking._id) {
            axios.delete(`/bookings/${booking._id}`)
                .then(() => {
                  
                    console.log("Booking cancelled successfully");
                  
                    setBooking(null);
                    alert('Booking has been cancelled');; // Set the message here
                    setRedirect(true);


                })
                .catch(error => {
                    console.error("Error cancelling booking:", error);
                    alert('Failed to cancel booking'); // Set an error message if cancellation fails
                  
                });
        }
    };

    if (redirect) {

        return <Navigate to={"/account/bookings"} />;
    }
  
    if (!booking) {
      return '';
    }
  
    return (
      <div className="my-8">
        <h1 className="text-3xl">{booking.place.title}</h1>
        <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
        <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-4">Your booking information:</h2>
            <BookingDates booking={booking} />
          </div>
          <div className="bg-primary p-6 text-white rounded-2xl">
            <div>Total price</div>
            <div className="text-3xl">${booking.price}</div>
          </div>
        </div>
        <PlaceGallery place={booking.place} />


        <button onClick={handleCancelBooking} className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                Cancel Booking
            </button>

            {message && (
                <div className="bg-green-200 p-4 rounded">
                    <p>{message}</p>
                </div>
            )}

      </div>
    );
  }


