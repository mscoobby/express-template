'use strict';

const Spec = require('./spec.controller');
const Router = require('express').Router;
const specRouter = Router();

module.exports = function(apiRouter, auth) {
    specRouter
        .route('/')
        .all(auth)
        .get(Spec.home);

    apiRouter.use('/spec', specRouter);
};
