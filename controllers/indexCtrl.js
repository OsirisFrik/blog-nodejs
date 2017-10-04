'use strict'

var indexCtrl = {}

indexCtrl.home = function (req, res) {
  res.send({message: 'hola'});
}

module.exports = indexCtrl;
