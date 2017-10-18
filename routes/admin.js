'use strict'

const express = require('express');
const multipart = require('connect-multiparty');
const adminCtrl = require('../controllers/adminCtrl');

const md_upload = multipart({uploadDir: './uploads/img/'});
var route = express.Router();

route.get('/', function (req, res) {
  res.redirect('/admin/dashboard');
});
route.get('/dashboard', adminCtrl.dashboard);
route.get('/settings', adminCtrl.config);
route.get('/media', adminCtrl.mediaview);
route.get('/newpost', adminCtrl.newpost);

module.exports = route;
