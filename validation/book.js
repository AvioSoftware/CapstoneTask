const isEmpty = require("../utils/is-empty");

module.exports = validateBookPlayload = (payload) => {
  const errors = {};
  if (isEmpty(payload.id)) errors.id = "Id is required!";
  if (isEmpty(payload.titie)) errors.title = "Title is requried!";
  else if (payload.titie.length > 30)
    errors.title = "Title must be shorter than 30 characters!";
  if (isEmpty(payload.author)) errors.author = "Author name is required!";
  else if (payload.author.length > 20)
    errors.author = "Author name must be shorter than 20 characters!";
  if (isEmpty(payload.publisher))
    errors.publisher = "Publisher name is required!";
  else if (payload.publisher.length > 20)
    errors.publisher = "Publisher name must be shorter than 20 characters!";
  if (isEmpty(payload.isbn)) errors.isbn = "ISBN is required!";
  if (!isEmpty(payload.who) && payload.who.length > 20)
    errors.who = "Who avail name must be shorter than 20 characters!";

  return { errors, isValid: isEmpty(errors) };
};
