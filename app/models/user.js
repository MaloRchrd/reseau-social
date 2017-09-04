// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const salt = bcrypt.genSaltSync(10);

// define the schema for our user model
var userSchema = mongoose.Schema({

    local			: {
        email		: String,
        password	: String,
    },
	profile			: {
		img			: String,
		pseudonyme	: String,
		name		: String,
		firstName	: String,
		work		: String,
		gender		: String,
		birthdate	: String,
		phone		: String,
		// insterest	: String,
		about		: String,
		facebook	: String,
		twitter		: String,
		linkedin	: String,
		github		: String,
		instagram	: String,
		friends		: [{type : mongoose.Schema.ObjectId, ref : 'User'}],
		friendRequest:  [{type : mongoose.Schema.ObjectId, ref : 'User'}],
	},
	setting 		:{
		notification: Boolean,
	},
	role 			: String,
	socketId		: String,

},{ versionKey: false });

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
