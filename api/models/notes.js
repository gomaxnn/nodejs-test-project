'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * Notes schema
 */
var NotesSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    spent: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notes', NotesSchema);
