'use strict'

var indexCtrl = {}

var backTo = null;

indexCtrl.home = function (req, res) {
  res.render('home', {title: 'Home'});
}

indexCtrl.registro = function (req, res) {
  res.render('registro', {
    layout: false,
    title: 'Registro'
  })
}

indexCtrl.login = function (req, res) {
  console.log(req.query);
  if (req.query.backTo) {
    backTo = req.query.backTo;
  }
  if (!req.user) {
    res.render('login', {title: 'Login', layout: false});
  } else {
    res.redirect('/');
  }
}

indexCtrl.loginCall = function (req, res) {
  if (req.user) {
    if (backTo) {
      res.redirect(backTo);
    } else {
      res.redirect('/');
    }
  } else {
    if (backTo) {
      res.redirect('/login?backTo='+backTo)
    } else {
      res.redirect('/login')
    }
  }
}

indexCtrl.logOut = function (req, res) {
  req.logout();
  res.redirect('/');
}

module.exports = indexCtrl;
