'use strict';

let jwt = require('jsonwebtoken');
let validator = require('validator');
let UserModel = require('../models/user');

module.exports = function() {
    
    // Create new user
    this.signup = function(req, res) {
        let name = req.body.name && req.body.name.trim(),
            email = req.body.email && req.body.email.trim(),
            password = req.body.password && req.body.password.trim(),
            password_confirm = req.body.password_confirm && req.body.password_confirm.trim();
        
        if (!name) {
            return res.status(400).json({ message: 'Name is a required field' });
        }
        if (!email) {
            return res.status(400).json({ message: 'Email is a required field' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'E-mail is not correct' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is a required field' });
        }
        if (!password_confirm) {
            return res.status(400).json({ message: 'Password Confirmation is a required field' });
        }
        if (password !== password_confirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        
        let user = new UserModel({
            name: name,
            email: email,
            password: password
        });
        
        user.save(function(err) {
            if (err) {
                console.error('User created Error', err);
                return res.status(500).json({ message: err.message });
            }
            
            console.log('User created', { email: user.email, name: user.name });
            return res.json({ data: {} });
        });
    }
    
    // Login
    this.signin = function(req, res) {
        let email = req.body.email && req.body.email.trim(),
            password = req.body.password && req.body.password.trim();
        
        if (!email) {
            return res.status(400).json({message: 'E-mail is a required field' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({message: 'E-mail is not correct' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is a required field' });
        }
        
        UserModel.findOne({ email: email }, function(err, user) {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            
            if (!user) {
                return res.status(400).json({ message: 'Unknown user' });
            }
            
            if (!user.checkPassword(password)) {
                return res.status(400).json({ message: 'Invalid password' });
            }
            
            console.log('User logged in', { email: user.email, name: user.name });
            
            return res.json({
                data: {
                    email: user.email,
                    name: user.name
                },
                token: generateToken.call(user)
            });
        });
    }
    
    // Generating access token
    let generateToken = function() {
        return jwt.sign({
            uid: this._id,
            scope: [
                'notes.create',
                'notes.read',
                'notes.update',
                'notes.delete'
            ]
        }, 'jwtsupersecret', { expiresIn: 3600 });
    }
};
