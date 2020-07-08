const express = require("express");
const router = express.Router();

const { getUsers, signup, login } = require("../controllers/user-controller");

router.get("/", getUsers);

router.post("/signup", signup);

router.post("/login", login);

module.exports = router;
