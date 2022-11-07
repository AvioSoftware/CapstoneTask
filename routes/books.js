// Importing moduels
const express = require("express");

// Importing models
const Book = require("../models/Book");
// Importing utils
const validateBookPlayload = require("../validation/book");
const isEmpty = require("../utils/is-empty");

const router = express.Router();

// @route GET /books
// @desc  Returns a list of all books (title & id) regardless of
//        checkout status (i.e. both available and checked-out books should be included)
//        and can be filtered by avail
router.get("/", (req, res) => {
  if (isEmpty(req.body.avail)) {
    Book.find()
      .select("id title")
      .then((result) => {
        if (!result) {
          return res.status(404).json({ msg: "not found" });
        }
        res.json({ msg: "ok", result });
      });
  } else {
    Book.find({ avail: req.body.avail }, "id title").then((result) => {
      if (!result) {
        return res.status(404).json({ msg: "not found" });
      }
      res.json({ msg: "ok", result });
    });
  }
});

// @route GET /books/:id
// @desc  Returns all details for the book matching id, 404 if not found
router.get("/:id", (req, res) => {
  Book.findOne({ id: req.params.id }).then((result) => {
    if (!result) {
      return res.status(404).json({ msg: "not found" });
    }
    res.json({ msg: "ok", result });
  });
});

// @route POST /books
// @desc  Add a new book as described in request body (JSON),
//        which includes id & status
router.post("/", (req, res) => {
  const { errors, isValid } = validateBookPlayload(req.body);
  if (!isValid) return res.status(400).json(errors);
  Book.findOne({ id: req.body.id }).then((result) => {
    if (result) {
      return res.status(403).json({ msg: "already exists" });
    }

    const newBook = new Book({
      id: req.body.id,
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher,
      isbn: req.body.isbn,
    });

    newBook
      .save()
      .then((result) => res.status(201).json({ msg: "created", result }));
  });
});

// @route PUT /books
// @desc  For book matching id, update any properties present in
//        request body (JSON). Can be used to check in or out
router.put("/:id", (req, res) => {
  Book.findOne({ id: req.params.id }).then((result) => {
    if (!result) {
      return res.status(404).json({ msg: "not found" });
    }

    if (!isEmpty(req.body.title)) result.title = req.body.title;
    if (!isEmpty(req.body.author)) result.author = req.body.author;
    if (!isEmpty(req.body.publisher)) result.publisher = req.body.publisher;
    if (!isEmpty(req.body.isbn)) result.isbn = req.body.isbn;
    if (!isEmpty(req.body.avail)) {
      if (req.body.avail) {
        result.avail = true;
        result.who = "";
        result.due = "";
      } else {
        if (!isEmpty(req.body.who)) {
          result.who = req.body.who;
          result.due = isEmpty(req.body.due) ? Date.now() : req.body.due;
          result.avail = false;
        } else {
          result.avail = true;
          result.who = "";
          result.due = "";
        }
      }
    }

    result.save().then((result) => res.status(200).json({ msg: "ok", result }));
  });
});

// @route DELETE /books
// @desc  Delete the book matching id (if it exits) regardless of checkout status
router.delete("/:id", (req, res) => {
  Book.findOne({ id: req.params.id }).then((result) => {
    if (!result) {
      return res.status(204).json({ msg: "no content" });
    }

    result
      .remove()
      .then((result) => res.status(200).json({ msg: "ok", result }));
  });
});

module.exports = router;
