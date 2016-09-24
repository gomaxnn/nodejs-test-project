'use strict';

let LocalStrategy = require('passport-local').Strategy;
let UserModel = require('../../models/user');

module.exports = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        let options = {
            criteria: { email: email }
        };
        
        UserModel.load(options, function(err, user) {
            if (err) {
                return done(err);
            }
            
            if (!user) {
                return done(null, false, { message: 'Unknown user' });
            }
            
            if (!user.authenticate(password)) {
                return done(null, false, { message: 'Invalid password' });
            }
            
            return done(null, user);
        });
    }
);
