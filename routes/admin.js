'use strict'

const express = require('express');
const adminCtrl = require('../controllers/adminCtrl');

var route = express.Router();

route.get('/', function (req, res) {
  res.redirect('/admin/dashboard');
});
route.get('/dashboard', adminCtrl.dashboard);
route.get('/settings', adminCtrl.config);

module.exports = route;
