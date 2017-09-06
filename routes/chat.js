

// REMOVED !!!!!
// REMOVED !!!!!
// REMOVED !!!!!





const express = require('express');
// const app = express();
const router = express.Router();
var path = require('path');
// var server = require('http').createServer(app);
// const socketIO = require('socket.io');
// var ioServer = io(server);
var User = require('../app/models/user');
var app = require('../app');


// var app = require('http').createServer(handler)
// var http = require('http');
// var server = http.createServer(app);
// var io = require('socket.io').listen(server);  //pass a http.Server instance
// server.listen(80);  //listen on port 80

// var server = app.listen(5000);
// var io = require('socket.io').listen(server);  //pass a http.Server instance


// const io = socketIO(router);




var fs = require('fs');

// Chatroom

router.get('/',isLoggedIn,function(req,res){

     res.render('chat',{user:req.user});

});


var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;


  socket.on('new user', function (data) {
  	console.log(data);
  })

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;
	console.log(addedUser);
    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
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
