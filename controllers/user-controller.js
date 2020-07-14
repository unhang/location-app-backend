const HttpError = require("../models/http-error");
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const USERS = [
  {
    id: "u1",
    name: "Hang Ung",
    image:
      "https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/user-male-icon.png",
    places: 3,
    email: "hang@gmail.com",
    password: "12345678",
  },
];

const getUsers = (req, res, next) => {
  res.json({ user: USERS });
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const validation = validationResult(req);

  if (validation.errors.length > 0) {
    throw new HttpError(
      422,
      "Could note create user due to invalid data input"
    );
  }


  const newUser = new User({
    name,
    email,
    password,
    image:
      "https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/user-male-icon.png",
  });

  try {
    await newUser.save();
  } catch(error) {
    return next(new HttpError(500, "Can not create user, please try again"))
  }

  if (hasUser) {
    return next(
      new HttpError(422, "Could not create user, email already exist")
    );
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
    image:
      "https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/user-male-icon.png",
    places: 3,
  };
  USERS.push(createdUser);
  res.status(201).json(createdUser);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError(401, "could not identify user"));
  }

  res.status(200).json({ message: "Login" });
};

exports.login = login;
exports.signup = signup;
exports.getUsers = getUsers;
