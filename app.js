'use strict'

const mongoose = require('mongoose');
const colors = require('colors');
const express = require('express');
const bodyParser = require('body-parser');
const exVal = require('express-validator');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const port = process.env.PORT || 3000;

const app = express();
const mongoConnect = "mongodb://localhost:27017/blog";

const index = require('./routes/index');

// bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Controll-Allow-Headers', '*');
  res.header('Access-Controll-Allow-Methos', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
});

// Express Validator
app.use(exVal({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {param: formParam, message: msg, value: value};
  }
}));

var getPublic = express.static(path.join(__dirname, 'public'));
var getModules = express.static(path.join(__dirname, 'node_modules'));

// handlebars config
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', exphbs({
  defaultLayout: 'layout',
  //layoutsDir: "bot/views/layouts",
  extname: '.html'
}));
app.set('view engine', '.html');

// set static folder
app.use(getPublic, getModules);

handlebars.registerHelper('repeat', function(item) {
  var out = '<tr>';
  for (name in item) {
    out += '<th><img src="/api/v1/images/' + item[name].image + '" class="perosna-img"></th>'+
    '<th>'+item[name].full_name+'</th>'+
    '<th>'+item[name].age+'</th>';
  }
  return out + '</tr>';
});

app.use('/', index);

mongoose.Promise = global.Promise;
mongoose.connect(mongoConnect, {
  useMongoClient: true
}, (err, res) => {
  if (err) {
    console.log('Error al conectar a la base de datos'.red);
    throw err;
  } else {
    console.log('Se ha conectado a la base de datos'.magenta);

    app.listen(port, function() {
      console.log(colors.cyan('Servidor corriendo en el puerto', port));
    });
  }
});
