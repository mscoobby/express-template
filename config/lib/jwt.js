const jwt = require('jsonwebtoken');
const express = require('express-jwt');
const sign = (user, exp, jti) =>
    jwt.sign({ sub: user._id, roles: user.role, exp, jti });

module.exports = {
    express,
    sign,
    jwt
};
