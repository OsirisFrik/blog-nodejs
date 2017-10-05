'use strict'

const express = require('express');
const passport = require('passport');
const colors = require('colors');
const LocalStrategy = require('passport-local').Strategy;
const indexCtrl = require('../controllers/indexCtrl');
const registroCtrl = require('../controllers/registroCtrl');
const bcrypt = require('bcrypt-nodejs');

const User = require('../models/user');

var route = express.Router();

var matchPassword = function(password, userPassword) {
  return new Promise(function(resolve, reject) {
    bcrypt.compare(password, userPassword, function(err, isMatch) {
      if (!err) {
        resolve(isMatch);
      } else {
        reject(err);
      }
    });
  });
}

passport.use(new LocalStrategy({
  usernameField: 'identby',
  passwordField: 'passwd'
}, function(identby, password, done) {
  User.findOne({
    $or: [
      {
        user_name: identby
      }, {
        email: identby
      }
    ]
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {message: 'Incorrect username.'});
    }
    matchPassword(password, user.password).then(function(response) {
      if (!response) {
        return done(null, false, {message: 'Incorrect password.'});
      } else {
        return done(null, user);
      }
    }).catch(function(err) {
      console.log(colors.red(err));
      return done(null, false, {message: 'Ha ocurrido un error interno.'})
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

route.get('/', indexCtrl.home);
route.get('/registro', indexCtrl.registro)
route.post('/registro', registroCtrl.reg)
route.get('/login', indexCtrl.login);
route.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), indexCtrl.loginCall);
route.get('/test', function(req, res) {
  res.send(req.session.passport)
});
route.get('/logout', indexCtrl.logOut);

module.exports = route;
