const mongoose = require("mongoose");

let bookSchema = mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
    max: 30,
  },
  author: {
    type: String,
    required: true,
    max: 20,
  },
  publisher: {
    type: String,
    required: true,
    max: 20,
  },
  isbn: {
    type: String,
    unique: true,
    required: true,
  },
  avail: {
    type: Boolean,
    default: true,
  },
  who: {
    type: String,
    max: 20,
  },
  due: Date,
});

module.exports = Book = mongoose.model("books", bookSchema);
