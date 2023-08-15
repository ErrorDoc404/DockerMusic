let config = require("../../config");

const Auth = (req, res, next) => {
  if (!req.user) return res.redirect(config.CallbackURL);
  else next();
};



module.exports = Auth;