module.exports = (app) => {
  const users = require("../controllers/userDetails.controllers");

  var router = require("express").Router();

  // Create a new user
  router.post("/", users.create);
  //   console.log("inside routers");
  // Retrieve all users
  router.get("/", users.findAll);

  app.use("/api/users", router);
};
