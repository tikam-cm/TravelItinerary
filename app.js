const {NotFound} = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authRouter = require('./routes/auth');
const itinerariesRouter = require('./routes/itineraries');
const sharableRouter = require('./routes/sharable');

const errorHandler = require('./middlewares/errorHandler');
const authenticateRequest = require('./middlewares/authenticateRequest');

const connectDb = require('./config/db.config');
const limit = require('./config/rateLimit.config');

connectDb();
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(limit);

/** Routes */
app.use('/api/auth', authRouter);
app.use('/api/itineraries/share', sharableRouter);
app.use('/api/itineraries', authenticateRequest,itinerariesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(new NotFound('Resource Not Found'));
});

// error handler
app.use(errorHandler);

module.exports = app;
