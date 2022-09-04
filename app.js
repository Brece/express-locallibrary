const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Import routes for "catalog" area of site
const catalogRouter = require('./routes/catalog');

// Import packages for deployment
const compression = require('compression');
const helmet = require('helmet');


// database -------------------------------------
//Import the mongoose module
const mongoose = require('mongoose');

//Set up mongoose connection 
const dev_db_url = 'mongodb+srv://user:user123@cluster0.ayay7nr.mongodb.net/local_library?retryWrites=true&w=majority';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// ----------------------------------------------

// app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Compress all routes
app.use(compression());
// Set appropriate HTTP headers that help protect your app from well-known web vulnerabilities
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));

// Add routes to the middleware chain
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

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
