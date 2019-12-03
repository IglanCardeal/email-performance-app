const express = require("express");
const { check, body } = require("express-validator");
const loginController = require("../controllers/all-controllers");

const router = express.Router();

const checkSession = (req, res, next) => {
  if (!req.session.isLogged) {
    return res.redirect("/");
  }
  return next();
};

router.get("/", loginController.login);

router.get("/sobre", loginController.sobre);

router.post(
  "/login",
  [
    check(
      "user",
      "Seu nome de usuario deve conter somente caracteres alfanumericos!"
    )
      .isAlpha()
      .trim(),
    body("password", "Senha deve ter no minimo 6 caracteres!").isLength({
      min: 6
    })
  ],
  loginController.postLogin
);

router.post("/logout", loginController.postLogout);

router.get("/home", checkSession, loginController.home);

router.post(
  "/sendemail",
  [
    body("destiny", "Formato de email informado invalido. Tente novamente.")
      .isEmail()
      .normalizeEmail(),
    body("message", "Escreva algo para enviar no corpo de email.").isLength({
      min: 1
    })
  ],
  checkSession,
  loginController.postSendEmail
);

router.get("/resultado", checkSession, loginController.resultado);

router.get("/historico", checkSession, loginController.historico);

router.get("/stress", loginController.testeStress);

module.exports = router;
