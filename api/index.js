'use strict';

const express = require('express');
const mongoose = require('mongoose');

let bodyParser = require('body-parser');
let methodOverride = require('method-override');

let port = process.env.PORT || 9000;

const app = express();
const connection = connect();

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

connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);

function listen() {
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

module.exports = {
    app,
    connection
};
