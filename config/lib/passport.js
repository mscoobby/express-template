const JsonStrategy = require('passport-json').Strategy;

/* NOTE: Pass passport object to this function when requiring the module */
module.exports = function(passport) {
    // =========================================================================
    //                       Passport session setup
    // =========================================================================
    // Required for persistent login sessions
    // Passport needs ability to serialize and unserialize users out of session

    // Used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Users.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(
        'json',
        new JsonStrategy(
            {
                usernameProp: 'user.username',
                passwordProp: 'user.password'
            },
            (username, password, done) => {
                const user = {
                    id: 1,
                    name: 'Georgi',
                    roles: ['admin']
                };
                done(null, user);
            }
        )
    );
};
