const db = require("../models");
const fetch = require("node-fetch");
const User = db.users;
const nodemailer = require("nodemailer");
require("dotenv").config();
let transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "ratingapp822@outlook.com",
    pass: process.env.USER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
// Create and Save a new user
exports.create = (req, res) => {
  // console.log("inside create controller");
  // console.log(req.body.handle);
  if (!req.body.handle && !req.body.email) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const user = new User({
    handle: req.body.handle,
    email: req.body.email,
    contestId: req.body.contestId,
    contestName: req.body.contestName,
  });
  console.log("USER", user);
  user
    .save(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the users.",
      });
    });
};
// Retrieve all user details from the database.
exports.findAll = (req, res) => {
  User.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};
var apiUrl = "https://codeforces.com/api/user.rating?handle=";
exports.findAndCheckConditions = () => {
  User.find()
    .then((allUsers) => {
      allUsers.forEach((user) => {
        // const fetch = require("node-fetch");
        // import { fetch } from "node-fetch";
        fetch(apiUrl + user.handle)
          .then((response) => response.json())
          .then((jsonData) => {
            // console.log("ratingss", jsonData);
            let newContestId =
              jsonData.result[jsonData.result.length - 1].contestId;
            let newContestName =
              jsonData.result[jsonData.result.length - 1].contestName;
            if (jsonData.result.length > 0 && newContestId != user.contestId) {
              const filter = { handle: user.handle };
              const update = {
                contestId: newContestId,
                contestName: newContestName,
              };
              console.log(filter, update);

              let oldRating =
                jsonData.result[jsonData.result.length - 1].oldRating;
              let newRating =
                jsonData.result[jsonData.result.length - 1].newRating;
              let mailOptions = {
                from: process.env.USER_EMAIL,
                to: user.email,
                subject: "Codeforces rating changes",
                html:
                  "Old Rating : " + oldRating + " New Rating : " + newRating,
              };
              transporter
                .sendMail(mailOptions)
                .then((res) => {
                  console.log("Email Sent Successfully!", res);
                  User.findOneAndUpdate(filter, update, { new: true }).then(
                    (res) => {
                      console.log("After Updating record,,,", res);
                    }
                  );
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log("Some arror occured", err);
          });
      });

      // console.log(data);
    })
    .catch((err) => {
      console.log("Some error occurred while retrieving users", err);
    });
};
