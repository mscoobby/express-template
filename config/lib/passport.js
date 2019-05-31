const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('config');

const User = require('../../modules/user/user.model');

module.exports = passport => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    /**
     * Authenticate using JWT
     */
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
                secretOrKey: config.get('TOKEN_SECRET')
            },
            (jwtPayload, done) => {
                User.findById(jwtPayload.sub, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {
                            msg: 'User not found'
                        });
                    }
                    return done(null, user);
                });
            }
        )
    );

    /**
     * Sign in using Email and Password.
     */
    passport.use(
        new LocalStrategy(
            { usernameField: 'email' },
            (email, password, done) => {
                User.findOne({ email: email.toLowerCase() }, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {
                            message: `Email ${email} not found.`
                        });
                    }
                    user.comparePassword(password, (err, isMatch) => {
                        if (err) {
                            return done(err);
                        }
                        if (isMatch) {
                            return done(null, user);
                        }
                        return done(null, false, {
                            msg: 'Invalid email or password.'
                        });
                    });
                });
            }
        )
    );
};
