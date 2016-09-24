'use strict';

let mongoose = require('mongoose'),
    userPlugin = require('mongoose-user'),
    Schema = mongoose.Schema;

/**
 * User schema
 */
var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        default: ''
    }
});

UserSchema.plugin(userPlugin, {});

// Extended methods
UserSchema.method({});

UserSchema.static({});

var User = mongoose.model('User', UserSchema);

module.exports = User;
