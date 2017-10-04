'use strict'

const express = require('express');

var route = express.Router();

route.get('/', function (req, res) {
  res.redirect('/admin/dashboard');
});

route.get('/dashboard', function (req, res) {
  if (req.user) {
    res.render('admin/dashboard', {layout: 'admin', title: 'Dashboard'});
  } else {
    res.redirect('/login')
  }
})

module.exports = route;
