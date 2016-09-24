'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const port = process.env.PORT || 9000;

const app = express();
const connection = connect();

module.exports = {
    app,
    connection
};

// Bootstrap routes
require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport);

connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);

function listen() {
    // if (app.get('env') === 'test') return;
    app.listen(port, function() {
        console.log('Express app started on port ' + port);
    });
}

function connect() {
    let options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    };
    
    // var connection = mongoose.connect(config.db, options).connection;
    let connection = mongoose.connect('mongodb://localhost/test', options).connection;
    return connection;
}
