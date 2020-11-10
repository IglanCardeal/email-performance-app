/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');

const User = require('../model/users');
const Historic = require('../model/historic');

const htmlBodyEmail = require('../resource/email-body');

dotenv.config();

const {
  transport,
  transportOverSMTP,
} = require('../resource/sendgrid-transport');

const renderHomeFunction = (
  req,
  res,
  error = null,
  destiny = null,
  message = null,
) => {
  res.render('home', {
    pageTitle: 'Enviar',
    path: 'inicio',
    isLogged: req.session.isLogged,
    error,
    destiny,
    message,
  });
};

module.exports = {
  login: (req, res, next) => {
    res.render('login', {
      pageTitle: 'Login',
      isLogged: req.session.isLogged,
      error: '',
    });
  },

  postLogin: async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('login', {
        pageTitle: 'Login',
        isLogged: req.session.isLogged,
        error: errors.array()[0].msg,
      });
    }

    const { user, password } = req.body;

    try {
      const hasAdmin = await User.findOne({ user: user.toLowerCase() })
        .select('+password')
        .exec();

      // Neste caso de nao haver nenhum admin cadastrado,
      // sera criado um novo com os dados inseridos.
      if (!hasAdmin) {
        const hashedPass = await bcrypt.hash(password, 12);

        const admin = new User({ user, password: hashedPass });

        await admin.save();

        return res.render('login', {
          pageTitle: 'Login',
          isLogged: req.session.isLogged,
          error:
            'Nenhum admin foi encontrado, logo foi criado e salvo no banco. Tente o login novamente.',
        });
      }

      const comparePass = await bcrypt.compare(password, hasAdmin.password);

      if (!comparePass) {
        return res.render('login', {
          pageTitle: 'Login',
          isLogged: req.session.isLogged,
          error: 'Nome de usuário ou senha incorretos! Tente novamente.',
        });
      }

      req.session.isLogged = true;
      res.redirect('/home');
    } catch (error) {
      next(error);
    }
  },

  postLogout: async (req, res, next) => {
    try {
      req.session.isLogged = false;

      await req.session.destroy();

      res.redirect('/');
    } catch (error) {
      next(error);
    }
  },

  home: (req, res, next) => {
    res.render('home', {
      pageTitle: 'Enviar',
      path: 'inicio',
      isLogged: req.session.isLogged,
      error: null,
      destiny: null,
      message: null,
    });
  },

  postSendEmail: async (req, res, next) => {
    const { destiny, subject, message } = req.body;
    const protocol = req.body.protocol || 'HTTP'; // padrao HTTP

    if (protocol !== 'HTTP' && protocol !== 'SMTP') {
      renderHomeFunction(
        req,
        res,
        'Protocolo submetido invalido! Tente novamente.',
        destiny,
        message,
      );
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      renderHomeFunction(req, res, errors.array()[0].msg, destiny, message);
    }

    const newHist = new Historic({
      data: dataAtualFormatada(),
      destino: destiny,
    });

    try {
      await newHist.save();

      const initialTime = new Date().getTime();

      res.redirect('resultado');

      // toda operacao async a partir daqui
      const sendEmailObject = {
        to: destiny,
        // from: process.env.APP_EMAIL,
        from:  {
          name: 'Email Performance App',
          address: process.env.APP_EMAIL,
      },
       
        subject:
          subject || 'Email de teste do aplicativo Email Performance App',
        html: htmlBodyEmail(message),
      };

      if (protocol === 'HTTP') {
        transport.sendMail(sendEmailObject, (error, info) => {
          callback(error, info, 'HTTP');
        });
      }

      if (protocol === 'SMTP') {
        transportOverSMTP.sendMail(sendEmailObject, (error, info) => {
          callback(error, info, 'SMTP');
        });
      }

      const callback = async (error, info, _protocol) => {
        newHist.protocol = _protocol;

        if (error) {
          newHist.state = 'failed';
          newHist.protocol = protocol;

          await newHist.save();

          throw error;
        }

        const finalTime = new Date().getTime() - initialTime;

        newHist.time = finalTime;
        newHist.state = 'success';

        await newHist.save();
      };
    } catch (error) {
      next(error);
    }
  },

  resultado: (req, res, next) => {
    res.render('resultado', {
      pageTitle: 'Enviar',
      path: '',
      isLogged: req.session.isLogged,
    });
  },

  historico: async (req, res, next) => {
    try {
      let smtpQty = 0;
      let httpQty = 0;

      const page = Math.floor(+req.query.page) || 1;
      const ITEMS_PER_PAGE = 5; // 5 historicos por pagina

      const [totalItems, historico, todoHistorico] = await Promise.all([
        Historic.find().countDocuments(),
        Historic.find()
          .sort({ data: -1 })
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE)
          .exec(),
        Historic.find(),
      ]);

      const arrayOfTimeHttp = todoHistorico
        .filter((h) => h.protocol === 'HTTP' && h.state === 'success')
        .map((h) => h.time);

      const arrayOfTimeSmtp = todoHistorico
        .filter((h) => h.protocol === 'SMTP' && h.state === 'success')
        .map((h) => h.time);

      arrayOfTimeSmtp.forEach((h) => {
        smtpQty += 1;
      });

      arrayOfTimeHttp.forEach((h) => {
        httpQty += 1;
      });

      const totalTempo = (acc, actual) => acc + actual;

      const tempoTotalSmtp = arrayOfTimeSmtp.reduce(totalTempo, 0);
      const tempoTotalHttp = arrayOfTimeHttp.reduce(totalTempo, 0);
      const tempoMedioSmtp = (tempoTotalSmtp / smtpQty || 0).toFixed(0);
      const tempoMedioHttp = (tempoTotalHttp / httpQty || 0).toFixed(0);

      res.render('historico', {
        pageTitle: 'Historico de envio',
        historico,
        path: 'historico',
        isLogged: req.session.isLogged,
        tempoMedioHttp,
        tempoMedioSmtp,
        arrayOfTimeHttp,
        arrayOfTimeSmtp,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(+totalItems / +ITEMS_PER_PAGE),
      });
    } catch (error) {
      next(error);
    }
  },

  sobre: (req, res, next) => {
    res.render('sobre', {
      pageTitle: 'Sobre projeto',
      path: 'sobre',
      isLogged: req.session.isLogged,
    });
  },

  testeStress: async (req, res) => {
    try {
      /**
       * Rota para teste de Stress de sistema
       */

      // const historic = await Historic.find().exec(); // para teste carga baixa

      // para teste de carga alta
      // let historic = 0;
      // while (historic < 1000000) {
      //   Math.random();
      //   historic += historic;
      // }

      crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', (error, hash) => {
        // res.status(200).json({
        //   message: 'Fim teste de estresse!',
        //   hash: hash.toString('hex'),
        // });
      });

      res.status(200).json({ message: 'Fim teste de estresse!', historic });
    } catch (error) {
      res.status(500).json({ message: 'Teste de estresse falhou!' });
    }
  },
};

const dataAtualFormatada = () => {
  const data = new Date();
  const dia = data.getDate().toString();
  const diaF = dia.length === 1 ? `0${dia}` : dia;
  const mes = (data.getMonth() + 1).toString(); // +1 pois no getMonth Janeiro começa com zero.
  const mesF = mes.length === 1 ? `0${mes}` : mes;
  const anoF = data.getFullYear();
  const hora = data.getHours();
  // eslint-disable-next-line operator-linebreak
  const min =
    data.getMinutes().toString().length === 1
      ? `0${data.getMinutes().toString()}`
      : data.getMinutes().toString();

  return `${diaF}/${mesF}/${anoF} as ${hora}:${min} horas`;
};
