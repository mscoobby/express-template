'use strict';

const config = require('config');
const jwt = require('../../config/lib/jwt');
const moment = require('moment');

var returnUser = (res, user, token) => res.json({ token: token || null, user });

var createToken = (user, exp, jwtid) =>
    jwt.sign({ sub: user._id, roles: user.role, exp }, config.jwt.secret, {
        jwtid
    });

module.exports = {
    login: (req, res, user, next) => {
        let exp = moment()
            .add(24, 'hours')
            .utc()
            .unix();
        if (!user) {
            throw new Error('Malformed request');
        }

        return new Promise((resolve, reject) =>
            req.login(user, err => (err ? reject(err) : resolve()))
        )
            .then(user => user.createToken(exp))
            .then(result => {
                let token = createToken(result.user, exp, result.id);
                return returnUser(res, user, token);
            })
            .catch(next);
    }
};
