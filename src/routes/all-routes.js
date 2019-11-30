const express = require("express");
const validator = require("express-validator");
const loginController = require("../controllers/all-controllers");

const router = express.Router();

router.get("/", loginController.login);

router.post("/login", loginController.postLogin);

router.post("/logout", loginController.postLogout);

router.get(
  "/home",
  (req, res, next) => {
    if (req.session.isLogged) {
      return next();
    }
    res.redirect("/");
  },
  loginController.home
);

router.post(
  "/sendemail",
  (req, res, next) => {
    if (req.session.isLogged) {
      return next();
    }
    res.redirect("/");
  },
  loginController.postSendEmail
);

router.get(
  "/resultado",
  (req, res, next) => {
    if (req.session.isLogged) {
      return next();
    }
    res.redirect("/");
  },
  loginController.resultado
);

router.get(
  "/historico",
  (req, res, next) => {
    if (req.session.isLogged) {
      return next();
    }
    res.redirect("/");
  },
  loginController.historico
);

module.exports = router;
