'use strict';

const express = require('express');
const logger = require('winston-color');
const config = require('./config');

let app = express();
let port = config.port || 9001;

app.use(express.static(__dirname + '/build'));

app.listen(port, function() {
    logger.info('The Front App is up on port: ', port);
});
