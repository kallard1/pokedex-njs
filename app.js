const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const manifest = require('express-manifest');
const engine = require('ejs-locals');
const bodyParser = require('body-parser');
const multer = require('multer');

const upload = multer({
  dest: __dirname + '/public/uploads'
});

mongoose.connect('', { useNewUrlParser: true });

require('./models/Pokemon');
require('./models/Type');

var pokemonsRouter = require('./routes/pokemons');
var typesRouter = require('./routes/types');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.single('file'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(manifest({
  manifest: path.join(__dirname, 'public') + '/dist/manifest.json',
  prepend: path.join(__dirname, 'public'),
  reqPathFind: /^(\/?)/,
  reqPathReplace: '',
  debug: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname + '/public/uploads')));
app.use('/', pokemonsRouter);
app.use('/type', typesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
