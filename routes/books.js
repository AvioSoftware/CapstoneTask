// Importing modueDatels
const express = require("express");

// Importing models
const Book = require("../models/Book");

const router = express.Router();

// @route GET /books
// @desc  Returns a list of all books
router.get("/", (req, res) => {
  Book.find()
    // .select("id title")
    .then((result) => {
      if (!result) {
        return res.status(404).json({ msg: "not found" });
      }
      res.json({ msg: "ok", result });
    });
});

// @route POST /books
// @desc  Get a list of books filtered by status
router.post("/", (req, res) => {
  if (req.body.status != undefined) {
    Book.find({ status: req.body.status } /*, "id title"*/).then((result) => {
      if (!result) {
        return res.status(404).json({ msg: "not found" });
      }
      res.json({ msg: "ok", result });
    });
  }
});

// @route POST /books/checkOut
// @desc  For book matching id, check out it
router.post("/checkOut/:id", (req, res) => {
  Book.findOne({ id: req.params.id }).then((result) => {
    if (!result) {
      return res.status(404).json({ msg: "not found" });
    }

    if (req.body.checkedOutBy != undefined) {
      result.checkedOutBy = req.body.checkedOutBy;
      result.dueDate = Date.now();
      result.status = true;
    } else {
      result.status = false;
      result.checkedOutBy = "";
      result.dueDate = "";
    }

    result.save().then((result) => res.status(200).json({ msg: "ok", result }));
  });
});

// @route POST /books/checkIn
// @desc  For book matching id, check in it
router.post("/checkIn/:id", (req, res) => {
  Book.findOne({ id: req.params.id }).then((result) => {
    if (!result) {
      return res.status(404).json({ msg: "not found" });
    }

    result.status = false;
    result.checkedOutBy = "";
    result.dueDate = "";

    result.save().then((result) => res.status(200).json({ msg: "ok", result }));
  });
});

module.exports = router;
