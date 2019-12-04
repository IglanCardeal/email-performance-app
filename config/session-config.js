module.exports = store => ({
  name: "projeto_redes2.sid",
  secret: ["78jfduu923bs1qpoiewa10xssd000212Wssadl9112"],
  resave: true,
  saveUninitialized: false,
  cookie: {
    path: "/",
    secure: "auto",
    maxAge: 3600000,
    httpOnly: true,
    sameSite: true
  },
  store: store
});
