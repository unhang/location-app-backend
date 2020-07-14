const HttpError = require("../models/http-error");
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (error) {
    return next(
      new HttpError(500, "Fetching users failed, please try again")
    );
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const validation = validationResult(req);
  if (validation.errors.length > 0) {
    return next(
      new HttpError(422, "Could note create user due to invalid data input")
    );
  }

  // validate if user exists already
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError(500, "Signing up failed, please try again"));
  }
  if (existingUser) {
    console.log(existingUser);
    return next(
      new HttpError(422, "User email exists already, please login instead")
    );
  }

  // create new user
  const newUser = new User({
    name,
    email,
    password,
    image:
      "https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/user-male-icon.png",
    places:[],
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError(500, "Can not create user, please try again"));
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError(500, "Something wrong, please try again"));
  }

  if (!user || user.password !== password) {
    return next(
      new HttpError(404, "Invalid credentials, please try again")
    );
  }
  res.status(200).json({ message: "Login" });
};

exports.login = login;
exports.signup = signup;
exports.getUsers = getUsers;
