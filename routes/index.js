'use strict'

const express = require('express');
const indexCtrl = require('../controllers/indexCtrl');
const registroCtrl = require('../controllers/registroCtrl');

var route = express.Router();

route.get('/', indexCtrl.home);
route.post('/registro', registroCtrl.reg)

module.exports = route;
