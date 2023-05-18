const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.task = require("./tasks");
db.refreshToken = require("./refreshToken.model");

db.ROLES = ["user", "admin"];

module.exports = db;