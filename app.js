process.env['NODE_CONFIG_DIR'] = __dirname + '/config/env/';
const config = require('config');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const sass = require('node-sass-middleware');
const passport = require('passport');
const mongoose = require('mongoose');
const jwt = require('./config/lib/jwt');

const modulesIndex = require('./modules/index');

const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(config.get('db.uri'), { useNewUrlParser: true });

mongoose.connection.on('error', err => {
    console.log(
        '%s MongoDB connection error. Please make sure MongoDB is running. %s',
        chalk.red('✗'),
        err
    );
    process.exit();
});

mongoose.set('debug', config.get('db.debug'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    sass({
        src: path.join(__dirname, 'scss'),
        dest: path.join(__dirname, 'public'),
        indentedSyntax: false, // true = .sass and false = .scss
        sourceMap: true,
        outputStyle: 'compressed'
    })
);

/**
 * Initialize passport middleware
 */
(function(passport, app) {
    require('./config/lib/passport')(passport);
    app.use(passport.initialize());
})(passport, app);

/**
 * Parse JWTs in requests
 */
(function(app) {
    let addUtilityRoles = (req, res, next) => {
        /* No user? Make them one. */
        if (!req.user) {
            req.user = {};
        }
        /* No role? Give them one. */
        if (!req.user.roles) {
            req.user.roles = ['guest'];
        }
        /* Everyone is literally everyone. */
        req.user.roles.push('everyone');

        /* Carry on (my wayward son) */
        return next();
    };

    /* Parse JWT. If any. */
    app.use(
        jwt.express({
            secret: config.get('TOKEN_SECRET'),
            credentialsRequired: false
        })
    );

    app.use(addUtilityRoles);
})(app);

app.use(express.static(path.join(__dirname, 'public')));

const apiRouter = express.Router();
app.use('/', apiRouter);

// Initialize modules
modulesIndex.init(apiRouter);

// catch 404 and forward to error handler
app.use((_req, _res, next) => next(createError(404)));

// error handler
app.use((err, req, res, _next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
