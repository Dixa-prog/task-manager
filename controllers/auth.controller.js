const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const cookieSession = require("cookie-session");
require('dotenv').config();

const express = require("express")
// import express from 'express';
const app = express();
// static files
app.use(express.static('./views'));

// ejs setup
app.set('view engine', 'ejs');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const RefreshToken = require("../models/refreshToken.model");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.findOne({ name: "user" }, (err, role) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      user.roles = role._id;
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        // res.render("login");
        res.send({ message: "User was registered successfully!" });
      });
    });
  });
};

exports.adminin = (req, res) => {
  const admin = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  admin.save((err, admin) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.findOne({ name: "admin" }, (err, role) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      admin.roles = role._id;
      admin.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        // res.render("login");
        res.send({ message: "Admin was registered successfully!" });
      });
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration, // 24 hours
      });

      let refreshToken = await RefreshToken.createToken(user);
      const authorities = user.roles.name.toUpperCase();
      req.session.token = token;
      req.session.user = {
        username: user.username,
        role: authorities
      };

      // console.log(user.roles.name.toUpperCase());
      if (authorities.includes('ADMIN')) {
        // res.send({ success: true, redirectTo: "/home" });
        res.send({ message: "Admin was loggedIn successfully!", token: token });
      } else {
        // res.send({ success: true, redirectTo: "/task" });
        res.send({ message: "User was loggedIn successfully!", token: token });
      }
    });
};



exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    res.redirect("/index");
  } catch (err) {
    console.log(err)
  }
};