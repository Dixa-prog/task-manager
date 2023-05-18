const express = require("express");
const cookieSession = require("cookie-session");
const tasks = require('./routes/tasks.js');
require('dotenv').config();
const app = express();
// const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');



// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "usersession",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);

app.use(express.static('./views'));

// ejs setup
app.set('view engine', 'ejs');


const db = require("./models");
const Role = db.role;

db.mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


app.use('/api/v1/tasks', tasks);
// app.use(notFound);
app.use(errorHandlerMiddleware);
// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}
