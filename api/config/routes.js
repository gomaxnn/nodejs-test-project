'use strict';

const jwt = require('jsonwebtoken');

const user = require('../handlers/user');
const notes = require('../handlers/notes');
const UserModel = require('../models/user');

module.exports = function(app) {
    
    // User API
    app.post('/signup', user.signup);
    app.post('/signin', user.signin);
    
    // Notes API
    app.get('/notes', isAuthenticated, notes.read);
    app.post('/notes', isAuthenticated, notes.create);
    app.put('/notes/:id', isAuthenticated, notes.update);
    app.delete('/notes/:id', isAuthenticated, notes.delete);
};

// Checking access token
function isAuthenticated(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (!token) {
        return res.status(403).json({ message: 'Token not provided' });
    }
    
    jwt.verify(token, req.app.get('appconf').jwt.secret, function(err, decoded) {
        if (err) {
            return res.status(401).json({
                message: 'Failed to authenticate token'
            });
        }
        
        // Checking user existence
        UserModel.findById(decoded.uid, function(err, user) {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            
            if (!user) {
                return res.status(401).json({ message: 'Unknown user' });
            }
            
            req['tokenPayload'] = decoded;
            return next();
        });
    });
}
