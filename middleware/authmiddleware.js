const usermodel = require('../models/usermodel');
const jwt = require('jsonwebtoken');

async function authUserMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // ✅ define user FIRST
    const user = await usermodel.findById(decoded.id);

    if (!user) {
      return res.redirect('/auth/login');
    }

    // ✅ then attach to req
    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.redirect('/auth/login');
  }
}

module.exports = {
  authUserMiddleware
};
