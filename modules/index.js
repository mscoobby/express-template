'use strict';
/**
 * Module dependencies.
 */
const utility = require('../config/lib/utility');
const assets = require('../config/assets');

const path = require('path');
const _ = require('lodash');

/* This is dirty */
var acl = new require('acl');
acl = new acl(new acl.memoryBackend());

/**
 * Configure the modules API routes
 */
const initModulesRoutes = apiRouter => {
    let auth = (req, res, next) => {
        let roles = req.user.roles;
        let path = req.baseUrl + req.route.path;

        acl.areAnyRolesAllowed(roles, path, req.method.toLowerCase())
            .then(isAllowed => {
                if (isAllowed) {
                    next();
                    return true;
                }

                return res
                    .status(403)
                    .json({ message: 'User is not authorized' });
            })
            .catch(err => {
                // An authorization error occurred
                return res.status(500).send('Unexpected authorization error');
            });
    };

    // Globbing routing files
    utility.getGlobbedPaths(assets.routes).forEach(routePath => {
        console.log(path.resolve(routePath));
        require(path.resolve(routePath))(apiRouter, auth);
    });
};

/**
 * Configure the modules policies
 */
const initModulePolicies = () => {
    // Globbing policy files
    utility.getGlobbedPaths(assets.policies).forEach(policyPath => {
        require(path.resolve(policyPath)).invokeRoles(acl);
    });

    // Inherit roles
    acl.addRoleParents('admin', ['everyone']);
};

// Init
module.exports.init = apiRouter => {
    initModulesRoutes(apiRouter);
    initModulePolicies();
};
