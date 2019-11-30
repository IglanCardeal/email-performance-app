// const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGrid = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator/check");
const dotenv = require("dotenv");

dotenv.config();

const htmlBodyEmail = () =>
  `
<div style="text-align: center;">
<h1 style="color: red">
  Projeto Redes II
</h1>
<p>
  Teste de envio!
</p>
</div>
`;

// Informamos ao nodemailer, qual o servico que sera usado para enviar emails.
// SendGrid sera usado como third service para o envio e tera as informacoes da key da conta.
const transport = nodemailer.createTransport(
  sendGrid({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

module.exports = {
  login: (req, res, next) => {
    res.render("login", {
      pageTitle: "Login"
    });
  },

  postLogin: (req, res, next) => {
    const { user, password } = req.body;
    if (!(user === "admin" && password === "123")) {
      res.json({ message: "nome de usuario ou senha incorretos!" });
    }
    req.session.isLogged = true;
    res.redirect("/home");
  },

  home: (req, res, next) => {
    res.render("home", {
      pageTitle: "Enviar"
    });
  },

  postSendEmail: (req, res, next) => {
    const { destiny, message } = req.body;
    console.log(destiny, message, process.env.APP_EMAIL);
    transport.sendMail({
      // to: email,
      to: "cubeleexuzz@gmail.com", // email de teste
      from: process.env.APP_EMAIL,
      subject: "Email de teste do projetod de redes II",
      html: htmlBodyEmail()
    });
    res.redirect("resultado");
  },

  resultado: (req, res, next) => {
    res.render("resultado", {
      pageTitle: "Enviar"
    });
  },

  sobre: (req, res, next) => {}
};
