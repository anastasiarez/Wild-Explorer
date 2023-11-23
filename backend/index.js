const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);
const jsonWebToken = require('jsonwebtoken');
const jwtSecret = 'fnr;nva4o5awbew/cvae';
const cookieParser = require('cookie-parser');
require("dotenv").config();
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const User = require("./models/User.js");
const Place = require('./models/Place.js');
const PlaceModel = require("./models/Place.js");
const Booking = require('./models/Booking.js');


const app = express();
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
);

// Move the database connection outside of the route handlers
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jsonWebToken.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        });
    });
}



app.post("/register", async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { name, email, password } = req.body;

    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json({ userDoc });
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    if (userDoc) {
        const passwordOK = bcrypt.compareSync(password, userDoc.password);
        if (passwordOK) {
            jsonWebToken.sign({
                email: userDoc.email,
                id: userDoc._id,
            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });
        } else {
            res.status(422).json('password is not ok');
        }
    } else {
        res.json('not found');
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});


app.get('/profile', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { token } = req.cookies;
    if (token) {
        jsonWebToken.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null);
    }
});

//download images from the web to a local destination
app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,

    });
    res.json(newName);
});


// to store files locally
const photosMiddleware = multer({ dest: 'uploads' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;

        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/', ''));
    }
    res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const { title, address, addedPhotos, description, price, perks, extraInfo, checkIn, checkOut, maxGuests } = req.body;
    jsonWebToken.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;

        try {
            const placeDoc = await Place.create({
                owner: userData.id,
                title,
                address,
                photos: addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price
            });

            res.json(placeDoc);// previous part run up to here
        } catch (error) {
            console.error('Error creating place:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
});


app.put('/places/:id', async (req, res) => {
    const { token } = req.cookies;
    const { id } = req.params;
    const { title, address, addedPhotos, description, price, perks, extraInfo, checkIn, checkOut, maxGuests } = req.body;
    jsonWebToken.verify(token, jwtSecret, {}, async (err, userData) => {

        if (err) throw err;
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title,
                address,
                photos: addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price,
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
});

app.get('/user-places', (req, res) => {
    const { token } = req.cookies;
    jsonWebToken.verify(token, jwtSecret, {}, async (err, userData) => {
        const { id } = userData;
        res.json(await Place.find({ owner: id }));
    });
});

app.get('/search-places', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Search query is missing.' });
        }




        const properties = await Place.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { address: { $regex: query, $options: 'i' } },
            ],
        });

        res.json(properties);
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//end points for index page
app.get('/places', async (req, res) => {
    res.json(await Place.find());
});



app.post('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
        const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
    } = req.body;
    Booking.create({
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
        user:userData.id,
    }).then((doc) => {
        res.json(doc);
    }).catch((err) => {
        throw err;
    });
});




app.get('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
   res.json( await Booking.find({user:userData.id}).populate('place'));
});


app.listen(4000, () => {
    console.log("Server is running on port 4000");
});

app.get("/test", (req, res) => {
    res.json("test ok");
});
