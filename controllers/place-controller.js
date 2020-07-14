const HttpError = require("../models/http-error");
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const Place = require("../models/place");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Landmark 81",
    description: "The most famous sky scraper in Vietnam",
    imageUrl:
      "https://kinhdoanhdiaoc.net/wp-content/uploads/2017/06/landmark-81-1.jpg",
    address: "20 W 34th St, New York, NY 1001",
    location: {
      lat: 10.7941662,
      lng: 106.7186276,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Landmark 81",
    description: "The most famous sky scraper in Vietnam",
    imageUrl:
      "https://kinhdoanhdiaoc.net/wp-content/uploads/2017/06/landmark-81-1.jpg",
    address: "20 W 34th St, New York, NY 1001",
    location: {
      lat: 10.7941662,
      lng: 106.7186276,
    },
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
    console.log(place);
  } catch (error) {
    console.log(error);
    throw new HttpError(500, "Could not find a place witt place id !");
  }
  // res.json(place);
  // or
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    console.log({ userId });
    places = await Place.find({ creator: userId });
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Fetching data failed, please try again"));
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError(404, "Could not find place for provided user Id")
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
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

  const createdPlace = new Place({
    title,
    description,
    imageUrl:
      "https://kinhdoanhdiaoc.net/wp-content/uploads/2017/06/landmark-81-1.jpg",
    location,
    address,
    creator,
  });

  try {
    await createdPlace.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Fetching data failed, please try again"));
    // or
    // throw new HttpError(500, "Creating place failed, please try again");
  }

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
    place = await Place.findById(placeId);
    console.log(place);
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Fetching failed, please try again"));
  }

  try {
    place.deleteOne();
  }catch (error) {
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
