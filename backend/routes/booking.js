const express = require('express')
const router = express.Router()
const Booking = require("../models/Booking");
const app = express();

router.post("/", async (req, res) => {

    //const userData = await getUserDataFromReq(req);
    const userData = res.locals.userData;
    console.log("User data inside /bookings,", userData);
    const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
      req.body;
    Booking.create({
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
      user: userData.id,
    })
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        throw err;
      });
  });

 
  router.post('/:bookingId', async (req, res) => {
    //const userData = await getUserDataFromReq(req);
    const userData = res.locals.userData;

    const {
      checkIn,
      checkOut,
      // place,
      // numberOfGuests,
      // name,
      // phone,
      // price,
    } = req.body;

    Booking.updateOne({user:userData.id},
      {
      checkIn,
      checkOut,
      // place,
      // numberOfGuests,
      // name,
      // phone,
      // price,
      // user: userData.id,
    }).then((doc) => {
      res.json(doc);
    }).catch((err) => {
      throw err;
    });
  });

  router.get("/",  async (req, res) => {
    //const userData = await getUserDataFromReq(req);
    const userData = res.locals.userData;
    res.json(await Booking.find({ user: userData.id }).populate("place"));
  });

  router.get('/:placeId', async (req, res) => {

    res.json(await Booking.find({ place: req.params.placeId }));
  });
  // Add this endpoint to handle deleting a booking by ID
router.delete('/:id', async (req, res) => {
    //const userData = await getUserDataFromReq(req);
    const userData = res.locals.userData;
    const { id } = req.params;

    try {
        // Find the booking by ID and the user ID to ensure ownership
        const booking = await Booking.findOneAndDelete({ _id: id, user: userData.id });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found or unauthorized' });
        }

        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;




