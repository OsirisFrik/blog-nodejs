'use strict'

const express = require('express');
const adminCtrl = require('../controllers/adminCtrl');

var route = express.Router();

route.get('/', function(req, res, next) {
  if (req.session.passport && req.session.passport.user && req.session.passport.user.admin) {
    next();
  } else if (req.session.passport && req.session.passport.user && !req.session.passport.user.admin) {
    req.flash('error', 'No tienes autorización');
    res.redirect('/');
  } else {
    console.log(req);
    res.redirect('/login?backTo=/admin');
  }
}, function (req, res) {
  req.redirect('/admin/dashboard');
});
route.get('/dashboard', adminCtrl.dashboard);
route.get('/settings', adminCtrl.config);

module.exports = route;
