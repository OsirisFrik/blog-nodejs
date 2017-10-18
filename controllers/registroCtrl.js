'use strict'

const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const moment = require('moment');
const colors = require('colors');
const esLocate = require('moment/locale/es');

moment.updateLocale('es', esLocate);

const userModel = require('../models/user');
const configMail = require('../configFiles/email.json');

var transporter = nodemailer.createTransport({
  host: configMail.host,
  secure: configMail.secure,
  port: configMail.port,
  auth: {
    user: configMail.user,
    pass: configMail.pass
  }
});

var sendMailConfirm = function (userData) {
  return new Promise(function(resolve, reject) {
    bcrypt.hash(userData._id, null, null, function (err, hash) {
      if (err) {
        reject(err)
      } else {
        var mailOptions = {
          from: configMail.user,
          to: userData.email,
          subject: 'Confirmación de registro.',
          text: 'Hola, gracias por registrarte en OsirisFrik Blog, por favor confirma tu correo electronico.',
          html: '<a href="http://localhost:3000/confirm?ref='+hash+'">Link</a>'
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log(mailOptions);
            console.log('Email sent: ' + info.response);
            resolve()
          }
        });
      }
    });
  });
}

var registroCtrl = {}

registroCtrl.reg = function(req, res) {
  req.checkBody('user_name', 'Se requiere un nombre de usuario.').notEmpty();
  req.checkBody('first_name', 'Se requiere un nombre').notEmpty();
  req.checkBody('last_name', 'Se requiere un apellido').notEmpty();
  req.checkBody('password', 'Se requiere una contraseña').notEmpty();
  req.checkBody('email', 'Se requiere un correo electronico').notEmpty();

  var errors = req.validationErrors();

  if (!errors) {
    var userData = req.body;
    var newUser = new userModel();

    newUser.user_name = userData.user_name;
    newUser.first_name = userData.first_name;
    newUser.last_name = userData.last_name;
    newUser.email = userData.email;
    newUser.twitter = userData.twitter;
    newUser.facebook = userData.facebook;
    newUser.github = userData.github;
    newUser.registroTime = moment().unix();

    userModel.findOne({
      $or: [
        {
          user_name: userData.user_name
        }, {
          email: userData.email
        }
      ]
    }, (err, user) => {
      if (!err && user) {
        if (user.user_name == userData.user_name) {
          res.render('registro', {
            layout: false,
            title: 'Registro',
            error: 'El nombre de usuario ' + userData.user_name + ' ya se encuentra registrado.'
          });
        } else if (user.email == userData.email) {
          res.render('registro', {
            layout: false,
            title: 'Registro',
            error: 'El correo ' + userData.email + ' ya se encuentra registrado.'
          });
        }
      } else if (err) {
        res.render('registro', {
          layout: false,
          title: 'Registro',
          error: 'Ha ocurrido un error.'
        })
      } else {
        if (userData.password == userData.passwordC) {
          bcrypt.hash(userData.password, null, null, function(err, hash) {
            if (!err) {
              newUser.password = hash;
              newUser.save((err, userStored) => {
                if (err) {
                  console.log(err);
                  res.render('registro', {
                    layout: false,
                    title: 'Registro',
                    error: 'Ha ocurrido un error al registrar al usuario.'
                  });
                } else {
                  if (!userStored) {
                    res.render('registro', {
                      layout: false,
                      title: 'Registro',
                      error: 'Ha ocurrido un error al registrar al usuario.'
                    });
                  } else {
                    sendMailConfirm(userStored).then(function(response) {
                      req.flash('successMsg', 'Se ha completado el registro, ha sido enviado un correo de confirmación a ' + userStored.email + '.');
                      res.redirect('/login');
                    }).catch(function(err) {
                      console.error(err);
                      res.render('registro', {
                        layout: false,
                        title: 'Registro',
                        error: 'Ha ocurrido un error al enviar el correo.'
                      });
                    });
                  }
                }
              });
            }
          });
        }
      }
    })
  } else {
    res.render('registro', {
      layout: false,
      title: 'Registro',
      error: errors[0].message
    });
  }
}

registroCtrl.confirm = function (req, res) {
  var idHash = req.query.ref;
  if (!req.user) {
    res.redirect('/login?backTo='+req.url)
  } else {
    console.log(req.user._id);
    var userId = req.user._id;
    bcrypt.compare(req.user._id, idHash, function (err, isMatch) {
      if (err) {
        console.log(colors.magenta(err));
        req.flash('error', 'Ha ocurrido un error interno.');
        res.redirect('/');
      }
      if (isMatch) {
        userModel.findOneAndUpdate({_id: req.user._id}, {emailConfirm: true}, (err, user) => {
          if (err) {
            console.log(colors.red(err));
            req.flash('error', 'Ha ocurrido un error.');
            res.redirect('/');
          }
          if (!user) {
            console.log('error de usuario'.red);
            req.flash('error', 'No se ha encontrado al usuario.');
            res.redirect('/');
          }
          req.flash('successMsg', 'Se a confirmado tu correo.');
          res.redirect('/');
        })
      } else {
        req.flash('error', 'Clave de referencia no coincide.');
        res.redirect('/');
      }
    });
  }
}

module.exports = registroCtrl;
