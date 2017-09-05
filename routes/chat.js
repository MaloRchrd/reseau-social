
const express = require('express');
const app = express();
const router = express.Router();
// var path = require('path');
// var server = require('http').createServer(app);
// const io = require('socket.io');
// var ioServer = io(server);
var User = require('../app/models/user');

// var app = require('http').createServer(handler)
// var http = require('http');
// var server = http.createServer(app);
// var io = require('socket.io').listen(server);  //pass a http.Server instance
// server.listen(80);  //listen on port 80

var server = app.listen(process.env.PORT || 3000);
var io = require('socket.io').listen(server);  //pass a http.Server instance

var fs = require('fs');

// Chatroom


router.get('/',isLoggedIn,function(req,res){

     res.render('chat',{user:req.user});

});

// function handler (req, res) {
//   fs.readFile(__dirname + '/chat.html',
//   function (err, data) {
//     if (err) {
//       res.writeHead(500);
//       return res.end('Error loading index.html');
//     }
//
//     res.writeHead(200);
//     res.end(data);
//   });
// }

// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });

var numUsers = 0;
//
// router.get('/', function(req, res) {
//     res.render('chat',{user : req.user});
// });
//
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
