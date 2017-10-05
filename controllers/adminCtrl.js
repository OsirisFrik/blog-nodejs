'use strict'

var adminCtrl = {};

adminCtrl.dashboard = function(req, res) {
  res.render('admin/dashboard', {
    layout: 'admin',
    title: 'Dashboard'
  });
}

adminCtrl.config = function (req, res) {
  res.render('admin/config', {
    layout: 'admin',
    title: 'Settings'
  })
}

module.exports = adminCtrl;
