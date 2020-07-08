const HttpError = require("../models/http-error");
const { v4: uuid} = require("uuid");
const {validationResult} = require("express-validator");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!place) {
    throw new HttpError(404, "Could not find a place witt place id !");
  }
  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((place) => place.creator === userId);

  if (!places || places.length === 0 ) {
    return next(404, "Could not find a place witt user id !");
  }
  res.json({ places });
};

const createPlace = (req, res, next) => {
  const error = validationResult(req);
  if (error) {
    console.log(error);
    return next(new HttpError(400, "Bad request"));
  }
  const { title, description, location, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location,
    address,
    creator,
  };

  res.status(201).json(createdPlace);
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatePlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  console.log(placeIndex, updatePlace);
  if (placeIndex < 0) {
    return next(new HttpError(404, "Could not find this api"));
  }
  updatePlace.title = title;
  updatePlace.description = description;

  DUMMY_PLACES[placeIndex] = updatePlace;

  res.status(200).json({ place: updatePlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES.filter(p => p.id !== placeId);

  res.status(200).json({message: "Deleted!"});
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
