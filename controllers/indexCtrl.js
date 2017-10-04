'use strict'

var indexCtrl = {}

indexCtrl.home = function (req, res) {
  console.log(res.locals);
  res.render('home', {title: 'Home'});
}

indexCtrl.login = function (req, res) {
  res.render('login', {title: 'Login'});
}

module.exports = indexCtrl;
