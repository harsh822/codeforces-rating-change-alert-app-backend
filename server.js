const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const db = require("./app/models");
const users = require("./app/controllers/userDetails.controllers");
const userDetailsModel = require("./app/models/userDetails.model");

var corsOptions = {
  origin: "https://codeforcesratingchangealertapp.web.app/",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://codeforcesratingchangealertapp.web.app/"
  );
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Headers", "content-type");
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
  // res.setHeader("Access-Control-Max-Age", "1800");
  // res.setHeader(
  //   "Access-Control-Allow-Methods",
  //   "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  // );
});
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// simple route

app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});
db.mongoose.set("strictQuery", false);
// console.log("DB URL", db.url);
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
setInterval(() => {
  users.findAndCheckConditions();
}, 10000);

// set port, listen for requests
require("./app/route/userDetails.routes")(app);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
