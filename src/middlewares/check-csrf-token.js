module.exports = (req, res, next) => {
  try {
    res.locals.isAuthenticated = req.session.isLoggedIn;

    if (!req.csrfToken()) throw new Error('Invalid CSRF TOKEN!');

    res.locals.csrfToken = req.csrfToken();

    next();
  } catch (error) {
    next(error);
  }
};
