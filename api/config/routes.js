'use strict';

let jwt = require('jsonwebtoken');

let User = require('../handlers/user');
let user = new User();

module.exports = function(app) {
    app.get('/users', isAuthenticated, user.getUsers);
    
    app.post('/user/new', user.newUser);
    
    app.post('/user/login', user.loginUser);
};

// Checking access token
function isAuthenticated(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (!token) {
        return res.status(403).json({ success: false });
    }
    
    jwt.verify(token, 'jwtsupersecret', function(err, decoded) {
        if (!err) {
            return next();
        }
        
        return res.json({
            success: false,
            message: 'Failed to authenticate token'
        });
    });
}
