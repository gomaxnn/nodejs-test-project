'use strict';

let User = require('../handlers/user');
let user = new User();

module.exports = function(app, passport) {
    app.get('/users', user.getUsers);
    
    app.post('/user/new', user.newUser);
    
    app.get('/user/auth', function(req, res) {
        res.send('User Auth');
    });
};
