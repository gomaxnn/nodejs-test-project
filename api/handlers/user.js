'use strict';

let UserModel = require('../models/user');

let User = function() {
    
    // Create new user
    this.newUser = function(req, res) {
        // console.log(req.body);
        // return res.send(req.body);
        
        let name = req.body.name,
            email = req.body.email,
            password = req.body.password;
        
        let user = new UserModel({
            name: name,
            email: email,
            hashed_password: password
        });
        
        user.save(function(err) {
            if (!err) {
                console.log('User created');
                return res.send({ status: 'OK', user: user });
            }
            else {
                console.error(err);
                return res.send({ status: 'ERROR', error: err.errors });
            }
        });
    }
    
    // Get users
    this.getUsers = function(req, res) {
        return UserModel.find(function (err, users) {
            if (!err) {
                return res.send(users);
            }
        });
    }
}

module.exports = User;
