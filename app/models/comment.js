// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const salt = bcrypt.genSaltSync(10);

// define the schema for our user model
var commentSchema = mongoose.Schema({

    comment			: {
        content		: String,
        author		: [{type : mongoose.Schema.ObjectId, ref : 'User'}],
        profile		: [{type : mongoose.Schema.ObjectId, ref : 'User'}],
		reply		: [{type : mongoose.Schema.ObjectId, ref : 'Comment'}],
		save_date	: {type: Date, default: Date.now},
    }},{ versionKey: false });

// create the model for users and expose it to our app
module.exports = mongoose.model('Comment', commentSchema);
