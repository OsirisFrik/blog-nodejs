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

adminCtrl.mediaview = function (req, res) {
  res.render('admin/media', {
    layout: 'admin',
    title: 'Media'
  });
}

adminCtrl.newpost = function (req, res) {
  res.render('admin/blog/newpost', {
    layout: 'admin',
    title: 'New Post'
  });
}

module.exports = adminCtrl;
