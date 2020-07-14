const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placeRouter = require("./routes/place-routes");
const userRouter = require("./routes/user-routes");
const HttpError = require("./models/http-error");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/place", placeRouter);
app.use("/api/user", userRouter);

// Error handler in case request came from invalid route
app.use((req, res, next) => {
  const error = new HttpError(404, "Could not find this api");
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const dbUri =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@hangung.iioeg.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected succeed !!");
  })
  .catch(() => {
    console.log("Connection failed !!");
  });

app.listen(5000);
