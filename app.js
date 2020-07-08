const express = require("express");
const bodyParser = require("body-parser");

const placeRouter = require("./routes/place-routes");
const userRouter = require("./routes/user-routes");
const HttpError = require("./models/http-error");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/place", placeRouter);
app.use("/api/user", userRouter);

app.use((req,res,next) => {
	const error = new HttpError(404, "Could not find this api");
	throw error;
});

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({message: error.message || "An unknown error occurred!"})
});

app.listen(5000);
