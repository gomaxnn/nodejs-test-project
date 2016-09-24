'use strict';

let local = require('./passport/local');
let UserModel = require('../models/user');

module.exports = function(passport) {
    // serialize and deserialize sessions
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => UserModel.findOne({ _id: id }, done));
    
    // use these strategies
    passport.use(local);
};
