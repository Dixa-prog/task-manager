const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const cookieSession = require("cookie-session");
require('dotenv').config();


exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    // First, query the Roles collection to get the _id of the 'user' role
    Role.findOne({ name: "user" }, (err, role) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      // Then, query the User collection with the _id of the 'user' role
      User.find({ roles: role._id })
        .populate("roles", "-__v")
        .exec((err, users) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.status(200).send(users);
        });
    });

  };
  
  exports.adminBoard = (req, res) => {
    // res.status(200).send("Admin Content.");
    // First, query the Roles collection to get the _id of the 'user' role
    Role.findOne({ name: "admin" }, (err, role) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      // Then, query the User collection with the _id of the 'user' role
      User.find({ roles: role._id })
        .populate("roles", "-__v")
        .exec((err, users) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.status(200).send(users);
        });
    });

  };
  
  