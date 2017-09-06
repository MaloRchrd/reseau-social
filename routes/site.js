const express = require('express');
const router = express.Router();
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

 var User = require('../app/models/user');
 var Comment = require('../app/models/comment');
 var mongoose = require('mongoose');

// |¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|
// |------------------------ static -------------------------|
// |_________________________________________________________|

router.get('/', function(req, res) {
    res.render('about',{user : req.user});
});

router.get('/credits', function(req, res) {
    res.render('credits');
});

router.get('/team', function(req, res) {
    res.render('team',{user : req.user});
});

router.get('/about', function(req, res) {
    res.render('about',{user : req.user});
});

router.get('/contact', function(req, res) {
    res.render('contact',{user : req.user});
});


router.get('/messages',isLoggedIn, function(req, res) {
	User.find({ _id: req.user._id }, function (err, users) {
		User.populate(users,{path:'profile.friends'},function(err, users) {
			// res.render('friends',{friends: users[0].profile.friends})
			res.render('message',{user : req.user, friends: users[0].profile.friends});
		});
	});
});


// |¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|
// |----------------- login/signin/session ------------------|
// |_________________________________________________________|

// signin page
router.get('/signin', function(req, res) {
    res.render('signin',{ messageWarning: req.flash('signupMessage') });
});

// signin Passport
router.post('/signin', passport.authenticate('local-signup', {
	   successRedirect : '/onboarding',
	   failureRedirect : '/signin',
	   failureFlash : true // allow flash messages
   }));

// get user info on first login
router.get('/onboarding',isLoggedIn, function(req, res) {
   res.render('onboarding',{user : req.user});
});

// Save onboarding data
router.post('/onboarding', function(req, res) {
	var img  =  req.body.img;
	var pseudonyme  =  req.body.pseudonyme;
	var name  =  req.body.name;
	var firstName  =  req.body.firstName;
	var email  =  req.body.email;
	var phone  =  req.body.phone;
	var birthdate  =  req.body.birthdate;
	var gender  =  req.body.gender;
	var about  =  req.body.about;
	var work  =  req.body.work;
	var facebook  =  req.body.facebook;
	var twitter  =  req.body.twitter;
	var github  =  req.body.github;
	var instagram  =  req.body.instagram;
	var linkedin  =  req.body.linkedin;
	var insterest  =  req.body.insterest;
	var setting  =  req.body.setting;
	// var id  =  req.body.id;
	User.findOneAndUpdate({'local.email': email}, {$set:{
		'profile.img':img,
		'profile.pseudonyme':pseudonyme,
		'profile.name':name,
		'profile.firstName':firstName,
		// 'profile.email':email,
		'profile.phone':phone,
		'profile.birthdate':birthdate,
		'profile.gender':gender,
		'profile.about':about,
		'profile.facebook':facebook,
		'profile.twitter':twitter,
		'profile.github':github,
		'profile.instagram':instagram,
		'profile.linkedin':linkedin,
		'profile.work':work,
		'profile.insterest':insterest,
		'setting.notification': setting,
		'role': 'user',
		}}, {new: true}, function(err, user){
	    if(err){
	        console.log("Fail Updating data ");
			res.send('fail');
	    }
    	res.send('updated');
	});

});

router.get('/login', function(req, res) {
    res.render('login',{ messageWarning: req.flash('loginMessage')  });
});


router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
}));


router.get('/logout',
	function(req, res){
    	req.logout();
    	res.redirect('/');
});



// |¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|
// |-------------------- user & community -------------------|
// |_________________________________________________________|


// my profile
router.get('/profile', isLoggedIn, function(req, res) {
	mongoose.model('User').findOne({"local.email":req.user.local.email }, function(err, user) {
		if (err) {
			console.log(err);
		}
		res.render('profile', {
			user : user
        });
	})
});

// edit profile
router.get('/edit-profile',isLoggedIn, function(req, res) {
	res.render('edit-profile', {
		user : req.user
	});
});


// random  user profile
router.get('/profile/:pseudonyme',isLoggedIn, function(req, res) {
	var pseudonyme = req.params.pseudonyme;
	if (pseudonyme == req.user.profile.pseudonyme) {
		res.redirect('/profile')
	}
	mongoose.model('User').findOne({"profile.pseudonyme":pseudonyme}, function(err, user) {
		if (err) {
			console.log(err);
		}
		var friends = req.user.profile.friends;
		var weAreFriends = friends.indexOf( new mongoose.Types.ObjectId(user._id));

		// if friends render template with comments
		if (weAreFriends != -1) {
			res.render('profile', {user : user});
		}else {
			res.render('user', {user : user});

		}
	});
});


// add friendRequest
// add in friends for req user and add in friendRequest in asked user
router.post('/addfriend/:pseudonyme', isLoggedIn, function(req, res) {
	var pseudonyme = req.params.pseudonyme
	User.findOneAndUpdate({"profile.pseudonyme": pseudonyme}, {$addToSet:{
		"profile.friendRequest" : req.user._id
	}}, {new: true}, function(err, user){
		console.log(user);
	if(err){
		console.log("Fail Updating data ",err);
		res.send('fail');
	}
		User.findOneAndUpdate({"profile.pseudonyme": req.user.profile.pseudonyme}, {$addToSet:{
			"profile.friends" : user._id
		}}, {new: true}, function(err, user){
		if(err){
			console.log("Fail Updating data ");
			res.send('fail');
		}
		res.send('updated');
		});
	});
});

// when friendRequest accepted
// remove from friendRequest and add to friends
router.get('/accept/:id', isLoggedIn, function(req, res) {
	var id = new mongoose.Types.ObjectId(req.params.id);

	User.findOneAndUpdate({"profile.pseudonyme": req.user.profile.pseudonyme}, {$pull:{
		"profile.friendRequest" : id
	}}, {safe: true, new: true }, function(err, user){
		if(err){
			console.log("Fail Updating data ");
		}
		// console.log(user._id);
		User.findOneAndUpdate({"profile.pseudonyme": req.user.profile.pseudonyme}, {$addToSet:{
			"profile.friends" : id
			}}, {new: true}, function(err, user){
			if(err){
				console.log("Fail Updating data ");
			}
			res.redirect('/friend-request');
		});
	});
});

router.get('/remove/:id', isLoggedIn, function(req, res) {
	var id = new mongoose.Types.ObjectId(req.params.id);

	User.findOneAndUpdate({"profile.pseudonyme": req.user.profile.pseudonyme}, {$pull:{
		"profile.friends" : id
	}}, {safe: true, new: true }, function(err, user){
		if(err){
			console.log("Fail Updating data ");
		}
		// console.log(user._id);
		User.findOneAndUpdate({"_id": id}, {$pull:{
			"profile.friends" : req.user._id
			}}, {new: true}, function(err, user){
			if(err){
				console.log("Fail Updating data ");
			}
			res.redirect('/friends');
		});
	});
});

// show list of friends
router.get('/friends',isLoggedIn, function(req, res) {
	User.find({ _id: req.user._id }, function (err, users) {
		User.populate(users,{path:'profile.friends'},function(err, users) {
			res.render('friends',{friends: users[0].profile.friends})
		});
	});
});

// show list of friend-request
router.get('/friend-request',isLoggedIn, function(req, res) {
	User.find({ _id: req.user._id }, function (err, users) {
		User.populate(users,{path:'profile.friendRequest'},function(err, users) {
			res.render('friend-request',{friendRequest: users[0].profile.friendRequest})
		});
	});
});

// Show all user
router.get('/community',isLoggedIn, function(req, res) {
	User.find(function(err,users) {
		if (err) {
			console.log(err);
		}
		res.render('community',{user : req.user, users:users});
	})

});




// |¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|
// |------------------------ Ajax Data ----------------------|
// |_________________________________________________________|



// Ajax usernamecheck for onboarding
router.post('/usernamecheck', function(req, res) {
	// console.log(req.body.pseudonyme);
	User.findOne({"profile.pseudonyme":req.body.pseudonyme }, function(err, pseudonyme) {
		if (err) {
			console.log(err);
		}
		if (pseudonyme === null) {
			res.send('available');
		}else {
			res.send('user exist');
		}
	});
});


// fucking friend match search  bien casse couille
router.post('/friendsSearch', function(req, res) {
	User.find({"profile.pseudonyme":new RegExp(req.body.friendsSearch, 'i') }, function(err, users) {
		if (err) {
			console.log(err);
		}
		var friendsMatch = [];
		for (var i = 0; i < users.length; i++) {
			if (req.user.profile.friends.indexOf(users[i]._id) != -1) {
				friendsMatch.push(users[i]);
			}

		}
		res.json(friendsMatch);

	});
});

router.post('/communitySearch', function(req, res) {
	User.find({"profile.pseudonyme":new RegExp(req.body.friendsSearch, 'i') }, function(err, users) {
		if (err) {
			console.log(err);
		}
		var communitybutNotMe = [];
		for (var i = 0; i < users.length; i++) {
			if (req.user._id != users[i]._id) {
				communitybutNotMe.push(users[i]);
			}
		}
		res.json(communitybutNotMe);

	});
});


router.post('/postComments', function(req, res) {
	console.log(req.body.comment.content);
	var comment = new Comment;
	comment.comment.content = req.body.comment.content;
	comment.comment.author = req.user._id;
	comment.comment.profile = new mongoose.Types.ObjectId(req.body.comment.profile);
	comment.save(function (err) {
		if (err) return handleError(err)
		console.log('comment saved');
		Comment.find({"comment.profile":new mongoose.Types.ObjectId(req.body.comment.profile)}, function(err, comments) {
			User.populate(comments,{path:'comment.author'},function(err, comments) {
			if (err) {
				console.log(err);
			}
			console.log(comments);
			res.json(comments)
			});
		});
	});
});

router.post('/getComments', function(req, res) {
	// console.log(req.body.userID);
	Comment.find({"comment.profile":new mongoose.Types.ObjectId(req.body.userID)}, function(err, comments) {
		User.populate(comments,{path:'comment.author'},function(err, comments) {
		if (err) {
			console.log(err);
		}
		// console.log(comments);
		res.json(comments)
		});
	});
});





router.get('/chat',isLoggedIn, function(req,res){
	// console.log(req.user);
	// res.send(req.user)
     res.render('chat',{user:req.user});

});



// |¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|
// |------------------------ helpers ------------------------|
// |_________________________________________________________|

// Show all user json helper
router.get('/community/json', function(req, res) {
	User.find(function(err,users) {
		if (err) {
			console.log(err);
		}
		res.send(users)
	})
});

// json populate helper
router.get('/friend-request/json',isLoggedIn, function(req, res) {
	User.find({ _id: req.user._id }, function (err, users) {
		User.populate(users,{path:'profile.friendRequest'},function(err, users) {
			// console.log( 'yo',users[0].profile.friendRequest[0]);
			res.send(users);
		});
	});
});


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if not redirect to the login page
    res.redirect('/login');
}

module.exports = router;
