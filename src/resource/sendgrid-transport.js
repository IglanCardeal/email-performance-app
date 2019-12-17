const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');

dotenv.config();

exports.transport = nodemailer.createTransport(
  sendGrid({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  }),
);

exports.transportOverSMTP = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD,
  },
});
