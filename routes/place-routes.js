const express = require("express");
const { check } = require("express-validator");
const {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/place-controller");
const router = express.Router();

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

router.patch("/:pid", updatePlace);

router.get("/:pid", getPlaceById);

router.delete("/:pid", deletePlace);

router.get("/user/:uid", getPlaceByUserId);

module.exports = router;
