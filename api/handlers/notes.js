'use strict';

const validator = require('validator');
const logger = require('winston-color');
const NotesModel = require('../models/notes');

let NotesHandler = function() {
    
    // Create a note
    this.create = function(req, res) {
        let payload = req.tokenPayload;
        
        if (payload.scope.indexOf('notes.create') === -1) {
			return res.status(403).json({ message: 'You do not have access to this resource.' });
		}
		
		let text = req.body.text && req.body.text.trim(),
            date = req.body.date && req.body.date.trim(),
            spent = req.body.spent;
        
        if (!text) {
            return res.status(400).json({ message: 'Text is a required field' });
        }
        if (!date) {
            return res.status(400).json({ message: 'Date is a required field' });
        }
        if (!validator.isDate(date)) {
            return res.status(400).json({ message: 'Date is incorrect' });
        }
        if (!spent) {
            return res.status(400).json({ message: 'Spent Time is a required field' });
        }
        if (!Number.isInteger(spent) && !validator.isInt(spent)) {
            return res.status(400).json({ message: 'Spent Time should be a number' });
        }
        
        let note = new NotesModel({
            uid: payload.uid,
            text: text,
            date: date,
            spent: spent
        });
        
        note.save(function(err) {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            
            console.log('NOTES CREATE:\n', note);
            
            return res.json({
                data: {
                    id: note._id,
                    text: note.text,
                    date: note.date,
                    spent: note.spent
                }
            });
        });
    }
    
    // Read notes
    this.read = function(req, res) {
        var payload = req.tokenPayload;
        
        if (payload.scope.indexOf('notes.read') === -1) {
			return res.status(403).json({ message: 'You do not have access to this resource.' });
		}
		
		NotesModel.find({ uid: payload.uid }, function(err, notes) {
            if (err) {
                return res.status(400).json(err);
            }
            
            var resData = [];
            
            notes.forEach(function(note) {
                resData.push({
                    id: note._id,
                    text: note.text,
                    date: note.date,
                    spent: note.spent
                });
            });
            
            return res.json({ data: resData });
		});
    }
    
    // Update a note
    this.update = function(req, res) {
        var payload = req.tokenPayload;
        
        if (payload.scope.indexOf('notes.update') === -1) {
			return res.status(403).json({ message: 'You do not have access to this resource.' });
		}
		
		let text = req.body.text && req.body.text.trim(),
            date = req.body.date && req.body.date.trim(),
            spent = req.body.spent;
        
        // Validation
        if (!text && !date && !spent) {
            return res.status(400).json({ message: 'There is nothing to update' });
        }
        if (date && !validator.isDate(date)) {
            return res.status(400).json({ message: 'Date is incorrect' });
        }
        if (spent && !Number.isInteger(spent) && !validator.isInt(spent)) {
            return res.status(400).json({ message: 'Spent Time should be a number' });
        }
        
        NotesModel.findById(req.params.id, function(err, note) {
		    if (err) {
		        return res.status(400).json({ message: err.message });
		    }
		    
		    if (note.uid != payload.uid) {
		        return res.status(400).json({ message: 'You can manipulate only your own notes.' });
		    }
		    
		    // Update fields
            if (text) {
                note.text = text;
            }
            if (date) {
                note.date = date;
            }
            if (spent) {
                note.spent = spent;
            }
            
            note.save(function(err) {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }
                
                console.log('NOTES UPDATE:\n', note);
                
                return res.json({
                    data: {
                        id: note._id,
                        text: note.text,
                        date: note.date,
                        spent: note.spent
                    }
                });
            });
        });
    }
    
    // Delete note
    this.delete = function(req, res) {
        var payload = req.tokenPayload;
        
        if (payload.scope.indexOf('notes.delete') === -1) {
			return res.status(403).json({ message: 'You do not have access to this resource.' });
		}
		
		NotesModel.findById(req.params.id, function(err, note) {
		    if (err) {
		        return res.status(400).json({ message: err.message });
		    }
		    
		    if (note.uid != payload.uid) {
		        return res.status(400).json({ message: 'You can manipulate only your own notes.' });
		    }
		    
		    note.remove(function(err) {
		        if (err) {
    		        return res.status(400).json({ message: err.message });
    		    }
    		    
    		    console.log('NOTES DELETE:\n', note);
    		    
    		    return res.json({});
		    });
		});
    }
}

module.exports = new NotesHandler();
