const { join } = require("path");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const session = require("express-session");

const allRoutes = require("./src/routes/all-routes");

const { generateLogErrors } = require("./errors/errors-log-handler");
const databaseConnection = require("./config/database-connection");

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
  let filepath = join(__dirname, "/logs/errors.log");
  // generateLogErrors(error, filepath, error.statusCode);
  console.error(error);
  res.render("error", {
    pageTitle: "Error",
    path: "",
    isLogged: req.session.isLogged
  });
});

try {
  app.listen(3000, () => {
    console.log(`APP running on PORT: ${3000}`);
  });
} catch (error) {
  console.log("****> Database connection error. Application will not start.\n");
  console.log(error);
}
