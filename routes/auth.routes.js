const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middleware");
// const controlleruser = require("../controllers/user.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  app.post(
    "/api/auth/adminin",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.adminin
  );
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/refreshtoken", controller.refreshToken);
  app.post("/api/auth/signout", controller.signout);

  // simple route
app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/home",  authJwt.checkAdmin, (req, res) => {
  res.render("home");
});
app.get("/admin-task",  authJwt.checkAdmin, (req, res) => {
  res.render("admin-task");
});
app.get('/register', (req, res) => {
  res.render('register');
});
app.get('/admin-register', (req, res) => {
  res.render('admin-register');
});
app.get("/task", (req, res) => {
  res.render("task");
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/main', (req, res) => {
  res.render('main');
});
app.get('/signout', (req, res) => {
  res.render('signout');
});
app.get("/check", (req, res) => {
  if (req.session.token) {
    console.log(req.session.user);
  } else {
    console.log("session doesn't exist");
  }
});
};

