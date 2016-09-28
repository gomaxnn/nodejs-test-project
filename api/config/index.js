'use strict';

const config = {
    port: 9000,
    mongodb: {
        uri: 'mongodb://localhost/test'
    },
    jwt: {
        secret: 'strong_secret_string'
    }
};

module.exports = config;
