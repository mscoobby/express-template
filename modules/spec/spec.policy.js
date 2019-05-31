'use strict';

module.exports.invokeRoles = acl => {
    // Defining roles and routes
    acl.allow([
        {
            roles: ['everyone'],
            allows: [
                {
                    resources: '/',
                    permissions: 'get'
                }
            ]
        }
    ]);

    // Inherit roles
    acl.addRoleParents('admin', ['everyone']);
};
