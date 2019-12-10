const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendGrid = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");

const User = require("../model/users");
const Historic = require("../model/historic");

const htmlBodyEmail = require("../resource/email-body");

dotenv.config();

const transport = nodemailer.createTransport(
  sendGrid({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

const transportOverSMTP = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD
  }
});

const renderHomeFunction = (
  req,
  res,
  error = null,
  destiny = null,
  message = null
) => {
  return res.render("home", {
    pageTitle: "Enviar",
    path: "inicio",
    isLogged: req.session.isLogged,
    error: error,
    destiny: destiny,
    message: message
  });
};

module.exports = {
  login: (req, res, next) => {
    res.render("login", {
      pageTitle: "Login",
      isLogged: req.session.isLogged,
      error: ""
    });
  },

  postLogin: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("login", {
        pageTitle: "Login",
        isLogged: req.session.isLogged,
        error: errors.array()[0].msg
      });
    }
    const { user, password } = req.body;
    try {
      const hasAdmin = await User.findOne({ user: user.toLowerCase() })
        .select("+password")
        .exec();
      if (!hasAdmin) {
        const hashedPass = await bcrypt.hash(password, 12);
        const admin = new User({ user: user, password: hashedPass });
        await admin.save();
        return res.render("login", {
          pageTitle: "Login",
          isLogged: req.session.isLogged,
          error:
            "Nenhum admin foi encontrado, logo foi criado e salvo no banco. Tente o login novamente."
        });
      }
      const comparePass = await bcrypt.compare(password, hasAdmin.password);
      if (!comparePass) {
        return res.render("login", {
          pageTitle: "Login",
          isLogged: req.session.isLogged,
          error: "Nome de usuário ou senha incorretos! Tente novamente."
        });
      }
      req.session.isLogged = true;
      res.redirect("/home");
    } catch (error) {
      next(error);
    }
  },

  postLogout: async (req, res, next) => {
    try {
      req.session.isLogged = false;
      await req.session.destroy();
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },

  home: (req, res, next) => {
    res.render("home", {
      pageTitle: "Enviar",
      path: "inicio",
      isLogged: req.session.isLogged,
      error: null,
      destiny: null,
      message: null
    });
  },

  postSendEmail: async (req, res, next) => {
    const { destiny, subject, message } = req.body;
    const protocol = req.body.protocol || "HTTP";
    if (protocol !== "HTTP" && protocol !== "SMTP") {
      return renderHomeFunction(
        req,
        res,
        "Protocolo submetido invalido! Tente novamente.",
        destiny,
        message
      );
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return renderHomeFunction(
        req,
        res,
        errors.array()[0].msg,
        destiny,
        message
      );
    }
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
      return `${diaF}/${mesF}/${anoF} as ${hora}:${min} horas`;
    };
    const newHist = new Historic({
      data: dataAtualFormatada(),
      destino: destiny
    });
    try {
      await newHist.save();
      let initialTime = new Date().getTime();
      res.redirect("resultado");
      const callback = async function(error, info, protocol) {
        newHist.protocol = protocol;
        if (error) {
          newHist.state = "failed";
          newHist.protocol = protocol;
          await newHist.save();
          throw error;
        }
        let finalTime = new Date().getTime() - initialTime;
        newHist.time = finalTime;
        newHist.state = "success";
        await newHist.save();
      };
      if (protocol === "HTTP") {
        transport.sendMail(
          {
            to: destiny,
            from: process.env.APP_EMAIL,
            subject:
              subject ||
              "Email de teste do projeto de redes de computadores II",
            html: htmlBodyEmail(message)
          },
          function(error, info) {
            return callback(error, info, "HTTP");
          }
        );
      }
      if (protocol === "SMTP") {
        transportOverSMTP.sendMail(
          {
            to: destiny,
            from: process.env.APP_EMAIL,
            subject:
              subject ||
              "Email de teste do projeto de redes de computadores II",
            html: htmlBodyEmail(message)
          },
          function(error, info) {
            return callback(error, info, "SMTP");
          }
        );
      }
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

  historico: async (req, res, next) => {
    try {
      let smtpQty = 0;
      let httpQty = 0;
      const historico = await Historic.find().exec();
      const arrayOfTimeHttp = historico
        .filter(h => {
          return h.protocol === "HTTP" && h.state === "success";
        })
        .map(h => h.time);
      const arrayOfTimeSmtp = historico
        .filter(h => {
          return h.protocol === "SMTP" && h.state === "success";
        })
        .map(h => h.time);
      arrayOfTimeSmtp.forEach(h => {
        smtpQty += 1;
      });
      arrayOfTimeHttp.forEach(h => {
        httpQty += 1;
      });
      const totalTempo = (acc, actual) => {
        return acc + actual;
      };
      const tempoTotalSmtp = arrayOfTimeSmtp.reduce(totalTempo, 0);
      const tempoTotalHttp = arrayOfTimeHttp.reduce(totalTempo, 0);
      const tempoMedioSmtp = (tempoTotalSmtp / smtpQty).toFixed(0);
      const tempoMedioHttp = (tempoTotalHttp / httpQty || 0).toFixed(0);
      res.render("historico", {
        pageTitle: "Historico de envio",
        historico: historico,
        path: "historico",
        isLogged: req.session.isLogged,
        tempoMedioHttp,
        tempoMedioSmtp,
        arrayOfTimeHttp,
        arrayOfTimeSmtp
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
  },

  testeStress: async (req, res) => {
    try {
      // const historic = await Historic.find().exec(); // para teste carga baixa

      // para teste de carga alta
      // let historic = 0;
      // while (historic < 1000000) {
      //   Math.random();
      //   historic++;
      // }

      crypto.pbkdf2("a", "b", 100000, 512, "sha512", (error, hash) => {
        res.status(200).json({
          message: "Fim teste de estresse!",
          hash: hash.toString("hex")
        });
      });

      // res.status(200).json({ message: "Fim teste de estresse!", historic });
    } catch (error) {
      res.status(500).json({ message: "Teste de estresse falhou!" });
    }
  }
};
