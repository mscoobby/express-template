'use strict';

const express = require('express');
const controller = require('./auth.controller');
const router = express.Router();

module.exports = function(apiRouter, auth) {
    router
        .route('/login')
        .all(auth)
        .post(controller.login);

    apiRouter.use('/auth', router);
};
