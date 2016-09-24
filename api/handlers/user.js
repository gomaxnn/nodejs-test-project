'use strict';

let jwt = require('jsonwebtoken');
let validator = require('validator');
let UserModel = require('../models/user');

module.exports = function() {
    
    // Create new user
    this.newUser = function(req, res) {
        let name = req.body.name && req.body.name.trim(),
            email = req.body.email && req.body.email.trim(),
            password = req.body.password && req.body.password.trim();
        
        if (!name) {
            return res.json({ success: false, message: 'Name is a required field' });
        }
        if (!email) {
            return res.json({ success: false, message: 'Email is a required field' });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'E-mail is not correct' });
        }
        if (!password) {
            return res.json({ success: false, message: 'Password is a required field' });
        }
        
        let user = new UserModel({
            name: name,
            email: email,
            password: password
        });
        
        user.save(function(err) {
            if (err) {
                console.error('User created Error', err);
                return res.json({ success: false, message: err.message });
            }
            
            console.log('User created', { email: user.email, name: user.name });
            return res.json({ success: true });
        });
    }
    
    // Login
    this.loginUser = function(req, res) {
        let email = req.body.email && req.body.email.trim(),
            password = req.body.password && req.body.password.trim();
        
        if (!email) {
            return res.json({ success: false, message: 'E-mail is a required field' });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'E-mail is not correct' });
        }
        if (!password) {
            return res.json({ success: false, message: 'Password is a required field' });
        }
        
        UserModel.findOne({ email: email }, function(err, user) {
            if (err) {
                return res.json({ success: false, message: err });
            }
            
            if (!user) {
                return res.json({ success: false, message: 'Unknown user' });
            }
            
            if (!user.checkPassword(password)) {
                return res.json({ success: false, message: 'Invalid password' });
            }
            
            console.log('User logged in', { email: user.email, name: user.name });
            
            return res.json({
                token: generateToken.call(user),
                email: user.email,
                name: user.name
            });
        });
    }
    
    // Get users
    this.getUsers = function(req, res) {
        return UserModel.find(function (err, users) {
            if (!err) {
                var result = [];
                
                users.forEach(function(user) {
                    result.push({
                        _id: user._id,
                        email: user.email,
                        name: user.name
                    });
                });
                
                return res.json(result);
            }
        });
    }
    
    // Generating access token
    let generateToken = function() {
        return jwt.sign({
            email: this.email,
            scope: [
                'notes.add',
                'notes.edit',
                'notes.delete'
            ]
        }, 'jwtsupersecret', { expiresIn: 3600 });
    }
};
