const { join } = require("path");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const session = require("express-session");

const allRoutes = require("./src/routes/all-routes");

const { checkErrors } = require("./errors/errors-log-handler");

const app = express();

app.set("view engine", "ejs");
app.set("views", join(__dirname, "./src/views"));

const sessionObject = {
  secret: ["78jfduu923bs1qpoiewa10xssd000212Wssadl9112"],
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: "/",
    secure: "auto",
    maxAge: 3600000,
    httpOnly: true,
    sameSite: true
  }
};

app.use(helmet());
app.use(session(sessionObject));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(csurf());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(express.static(join(__dirname, "./src/public")));
app.use(allRoutes);
app.use((error, req, res, next) => {
  let filepath = join(__dirname, "/logs/errors");
  checkErrors(error, filepath, error.statusCode);
  res.render("error", {
    pageTitle: "Error de servidor"
  });
});

app.listen(3000, () => {
  console.log(`APP running on PORT: ${3000}`);
});
