import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
// import PlaceImg from "../PlaceImg";
import { differenceInCalendarDays, format } from "date-fns";
import BookingDates from "../BookingDates";


export default function BookingsPage() {
    const [bookings, setBookings] = useState([]); //it marks an error on console
    useEffect(() => {
        axios.get('/bookings').then(response => {
            setBookings(response.data);
        });
    }, []);

    return (
        <div>
            <AccountNav />
            <div>
                {bookings?.length > 0 && bookings.map(booking => (
                    <div
                        className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mt-7">

                        {/* <div className="w-full h-40 overflow-hidden">
                                {place.photos.length > 0 && (
                                    <img
                                        className="w-full h-full object-cover"
                                        src={"http://localhost:4000/uploads/" + place.photos[0]}
                                        alt=""
                                    />
                                )}
                            </div> */}

                        <div className="py-3pr-3 grow">
                            <h2 className="text-xl">{booking.place.title}</h2>

                           <BookingDates booking={booking}  className="mb-2 mt-4 text-gray-500"/>





                            <div className="text-xl">





                                <div className="flex gap-1 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                    Total Price:  ${booking.price}
                                </div>

                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

//http://localhost:5173/account/bookings/6560affb49be4305d1d34743