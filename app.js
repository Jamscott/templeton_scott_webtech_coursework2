const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const console = require('console');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const conversation = require('./routes/conversation');

const app = express();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: false
}));

require('./middleware/passport')(passport);

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

mongoose
.connect('mongodb+srv://user:coursework@coursework-0ykkr.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
.then(console.log("Successfully connected to database"))
.catch(err => console.log(err));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/conversations', conversation);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
