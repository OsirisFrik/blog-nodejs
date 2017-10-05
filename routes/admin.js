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
    res.redirect('/login?backTo=/admin');
  }
}, function (req, res) {
  res.redirect('/admin/dashboard');
});
route.get('/dashboard', adminCtrl.dashboard);
route.get('/settings', adminCtrl.config);

module.exports = route;
