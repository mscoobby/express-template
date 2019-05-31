'use strict';

module.exports = {
    invokeRoles: acl => {
        // Defining roles and routes
        acl.allow([
            {
                roles: 'guest',
                allows: [
                    {
                        resources: '/api/auth/login',
                        permissions: 'post'
                    },
                    {
                        resources: '/api/auth/logout',
                        permissions: 'post'
                    }
                ]
            }
        ]);

        // Inherit roles
        acl.addRoleParents('admin', ['guest']);
    }
};
