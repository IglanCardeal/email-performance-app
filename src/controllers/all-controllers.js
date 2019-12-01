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
      pageTitle: "Login",
      isLogged: req.session.isLogged,
      error: ""
    });
  },

  postLogin: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("login", {
        pageTitle: "Login",
        isLogged: req.session.isLogged,
        error: errors.array()[0].msg
      });
    }
    const { user, password } = req.body;
    if (!(user === "admin" && password === "123")) {
      return res.render("login", {
        pageTitle: "Login",
        isLogged: req.session.isLogged,
        error: "Nome de usuario ou senha incorretos! Tente novamente."
      });
    }
    req.session.isLogged = true;
    res.redirect("/home");
  },

  postLogout: (req, res, next) => {
    req.session.isLogged = false;
    res.redirect("/");
  },

  home: (req, res, next) => {
    res.render("home", {
      pageTitle: "Enviar",
      path: "inicio",
      isLogged: req.session.isLogged,
      error: null
    });
  },

  postSendEmail: (req, res, next) => {
    const { destiny, message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("home", {
        pageTitle: "Login",
        isLogged: req.session.isLogged,
        error: errors.array()[0].msg,
        path: "inicio"
      });
    }
    try {
      transport.sendMail({
        // to: email,
        to: "cubeleexuzz@gmail.com", // email de teste
        from: process.env.APP_EMAIL,
        subject: "Email de teste do projetod de redes II",
        html: htmlBodyEmail()
      });
      res.redirect("resultado");
    } catch (error) {
      next(error);
    }
  },

  resultado: (req, res, next) => {
    res.render("resultado", {
      pageTitle: "Enviar",
      path: "",
      isLogged: req.session.isLogged
    });
  },

  historico: (req, res, next) => {
    try {
      // Salvar no data no banco como string no formato: dia/mes/ano as hora;
      const dataAtualFormatada = () => {
        let data = new Date(),
          dia = data.getDate().toString(),
          diaF = dia.length == 1 ? "0" + dia : dia,
          mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
          mesF = mes.length == 1 ? "0" + mes : mes,
          anoF = data.getFullYear(),
          hora = data.getHours(),
          min =
            data.getMinutes().toString().length == 1
              ? "0" + data.getMinutes().toString()
              : data.getMinutes().toString();
        return `${diaF}/${mesF}/${anoF} as ${hora}:${min} `;
      };
      let historico = [
        {
          data: dataAtualFormatada(),
          destino: "cubeleexuzz@gmail.com",
          state: "success",
          status: "Email enviado"
        },
        {
          data: dataAtualFormatada(),
          destino: "velpac-sgs@gmail.com",
          state: "waiting",
          status: "Email pendente"
        },
        {
          data: dataAtualFormatada(),
          destino: "velpac-sgs@gmail.com",
          state: "failed",
          status: "Erro ao enviar. Verifique email de origem e tente novamente"
        }
      ];
      res.render("historico", {
        pageTitle: "Historico de envio",
        historico: historico,
        path: "historico",
        isLogged: req.session.isLogged
      });
    } catch (error) {
      next(error);
    }
  },

  sobre: (req, res, next) => {
    res.render("sobre", {
      pageTitle: "Sobre projeto",
      path: "sobre",
      isLogged: req.session.isLogged
    });
  }
};
