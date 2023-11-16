const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

console.log(process.env.MONGO_URL);
const connectDb = async () =>  await mongoose.connect(process.env.MONGO_URL);
connectDb().then((db) => console.log("connect", db)).catch(err => console.log(err));

app.get("/test", (req, res) => {
  res.json("test ok");
});

// app.listen(4000);

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  res.json({ name, email, password });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
