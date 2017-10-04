'use strict'

var indexCtrl = {}

var backTo = null;

indexCtrl.home = function (req, res) {
  console.log(res.locals);
  res.render('home', {title: 'Home'});
}

indexCtrl.login = function (req, res) {
  if (req.query.backTo) {
    backTo = req.query.backTo;
  }
  if (!req.user) {
    res.render('login', {title: 'Login'});
  } else {
    res.redirect('/');
  }
}

indexCtrl.loginCall = function (req, res) {
  if (req.session.passport && req.session.passport.user) {
    if (backTo) {
      res.redirect(backTo);
    } else {
      res.redirect('/');
    }
  }
}

indexCtrl.logOut = function (req, res) {
  req.logout();
  res.redirect('/');
}

module.exports = indexCtrl;
