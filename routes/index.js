'use strict'

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const indexCtrl = require('../controllers/indexCtrl');
const registroCtrl = require('../controllers/registroCtrl');
const bcrypt = require('bcrypt-nodejs');

const User = require('../models/user');

var route = express.Router();

var matchPassword = function (password, userPassword) {
  bcrypt.compare(password, userPassword, function (err, isMatch) {
    if (!err) {
      return isMatch
    } else {
      return err
    }
  })
}

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ user_name: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (matchPassword(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }      
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


route.get('/', indexCtrl.home);
route.post('/registro', registroCtrl.reg)
route.get('/login', indexCtrl.login);
route.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));
route.get('/test', function (req, res) {
  res.send(req.session.passport)
})

module.exports = route;
