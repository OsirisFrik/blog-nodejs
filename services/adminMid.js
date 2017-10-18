'use strict'

var adminMid = {};

adminMid.adminCheck = function (req, res, next) {
  if (req.session.passport && req.session.passport.user && req.session.passport.user.admin) {
    next();
  } else if (req.session.passport && req.session.passport.user && !req.session.passport.user.admin) {
    req.flash('error', 'No tienes autorización');
    res.redirect('/');
  } else {
    res.redirect('/login?backTo=/admin'+req.url);
  }
}

module.exports = adminMid;
