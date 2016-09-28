'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const logger = require('winston-color');

let app = express();

app.set('appconf', require('./config')); // load config

app.use(bodyParser.json());
app.use(methodOverride());

// CORS settings
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// Routes
require('./config/routes')(app);

// Database connection
let connection = connect();

connection
    .on('error', logger.error)
    .on('disconnected', connect)
    .once('open', listen);

function listen() {
    let port = app.get('appconf').port || 9000;
    
    app.listen(port, function() {
        logger.info('Express app started on port ' + port);
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
    
    return mongoose.connect(app.get('appconf').mongodb.uri, options).connection;
}

module.exports = {
    app,
    connection
};
