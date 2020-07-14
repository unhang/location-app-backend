const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
    console.log(place);
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Something wrong, please try again!"));
  }
  if (!place) {
    return next(new HttpError(422, "Could not find a place witt place id !"));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // Alternative Approach
  // let places;
  // try {
  //   places = await Place.find({ creator: userId });
  // } catch (error) {
  //   console.log(error);
  //   return next(new HttpError(500, "Fetching data failed, please try again"));
  // }

  // if (!places || places.length === 0) {
  //   return next(
  //     new HttpError(404, "Could not find place for provided user Id")
  //   );
  // }
  // res.json({
  //   places: places.map((place) => place.toObject({ getters: true })),
  // });

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Fetching data failed, please try again"));
  }
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError(404, "Could not find place for provided user Id")
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  // validation from check() in router file;
  if (error.length > 0) {
    console.log(error);
    return next(new HttpError(400, "Bad request"));
  }

  const { title, description, location, address, creator } = req.body;

  // STEP 1: find user
  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError(500, "Creating place failed, please try again"));
  }

  // STEP 2: check user
  if (!user) {
    return next(
      new HttpError(404, "Could not find user by provided id, please try again")
    );
  }

  const createdPlace = new Place({
    title,
    description,
    imageUrl:
      "https://kinhdoanhdiaoc.net/wp-content/uploads/2017/06/landmark-81-1.jpg",
    location,
    address,
    creator,
  });

  // start transaction
  try {
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Creating data failed, please try again"));
  }
  // end transaction

  res.status(201).json(createdPlace);
};

const updatePlace = async (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;

  // STEP 1: find a place by id
  try {
    place = await Place.findById(placeId);
    console.log(place);
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Fetching failed, please try again"));
  }

  place.title = title;
  place.description = description;

  //STEP 2: update place and save
  try {
    await place.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Something wrong, please try again"));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  // STEP 1: find a place by id
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Something wrong, please try again"));
  }
  if (!place) {
    return next(new HttpError(404, "Could not fetch place for provided id"));
  }

  try {
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Delete request failed, please try again"));
  }

  res.status(200).json({ message: "Deleted!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
