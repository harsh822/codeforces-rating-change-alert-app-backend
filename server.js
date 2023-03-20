const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const db = require("./app/models");
const users = require("./app/controllers/userDetails.controllers");
const userDetailsModel = require("./app/models/userDetails.model");

var corsOptions = {
  origin: "http://localhost:4200",
};
// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
//     next();
//   });
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