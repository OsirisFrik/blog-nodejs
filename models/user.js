'use strict'

const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var user = Schema({
  user_name: String,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  avatar: String,
  twitter: String,
  facebook: String,
  github: String,
  admin: Boolean,
  emailConfirm: Boolean,
  registroTime: Number
});

user.plugin(mongoosePaginate);

module.exports = mongoose.model('users', user);
