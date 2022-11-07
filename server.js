// Importing modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Importing configs
const config = require(process.env.NODE_ENV === "production"
  ? "./config/production"
  : "./config/development");
// Importing routes
const booksRoute = require("./routes/books");

// Connecting to db
mongoose.connect(config.mongodbURI);

const app = express();

// App configuruation
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});

app.use("/books", booksRoute);

app.listen(config.port, () =>
  console.log(`Server running on port ${config.port}`)
);
