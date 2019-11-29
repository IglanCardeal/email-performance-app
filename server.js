const { join } = require("path");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const session = require("express-session");

const allRoutes = require("./src/routes/all-routes");

const { unhandledException } = require("./errors/errors-log-handler");

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

process.on("uncaughtException", error => {
  const filepath = path.join(__dirname, "/logs/uncaught-exception-errors.log");
  unhandledException(error, filepath, "uncaughtException");
});

process.on("unhandledRejection", error => {
  const filepath = path.join(__dirname, "/logs/unhandled-rejection-errors.log");
  unhandledException(error, filepath, "unhandledRejection");
});

app.listen(3000, () => {
  console.log(`APP running on PORT: ${3000}`);
});
