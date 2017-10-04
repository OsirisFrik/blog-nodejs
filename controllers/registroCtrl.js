'use strict'

const bcrypt = require('bcrypt-nodejs');
const userModel = require('../models/user');

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
    newUser.admin = true;

    console.log(userData);

    userModel.findOne({$or:[{ user_name: userData.user_name}, {email: userData.email}]}, (err, user) => {
      if (!err && user) {
        if (user.user_name == userData.user_name) {
          res.send({message: 'El nombre de usuario '+userData.user_name+' ya se encuentra registrado.'});
        } else if (user.email == userData.email) {
          res.send({message: 'El correo '+userData.email+' ya se encuentra registrado.'});
        }
      } else if (err) {
        res.send({message: 'Ha ocurrido un error'})
      } else {
        if (userData.password == userData.passwordC) {
          bcrypt.hash(userData.password, null, null, function(err, hash) {
            if (!err) {
              newUser.password = hash;
              newUser.save((err, userStored) => {
                if (err) {
                  res.status(500).send({message: "Error al registrar el usuario"});
                } else {
                  if (!userStored) {
                    res.status(404).send({message: "Error al registrar el usuario"});
                  } else {
                    res.status(200).send({message: "Se ha registrado al usuario"});
                    console.log(userStored);
                  }
                }
              });
            }
          });
        }
      }
    })
  } else {
    res.send(errors)
  }
}

module.exports = registroCtrl;
