'use strict';

let session = require('express-session');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let cookieSession = require('cookie-session');

let mongoStore = require('connect-mongo')(session);

module.exports = function(app, passport) {
    // Body parser
    // app.use(bodyParser.urlencoded({
    //     extended: true
    // }));
    
    app.use(bodyParser.json());
    
    // Session
    app.use(cookieParser());
    app.use(cookieSession({ secret: 'cookieSessionSecret' }));
    app.use(session({
        secret: 'expressSessionSecret',
        proxy: true,
        resave: true,
        saveUninitialized: true,
        store: new mongoStore({
            url: 'mongodb://localhost/test',
            collection : 'sessions'
        })
    }));
    
    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());
};
