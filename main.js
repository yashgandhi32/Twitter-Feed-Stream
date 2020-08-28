const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
var path = require("path");

//app intialization
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//starting mongodb service
require("./db/mongodb");

// routes
app.use("/api", routes);

//home page
app.use("/", (req, res) => res.render('index.ejs'));

//express server
const port = 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
