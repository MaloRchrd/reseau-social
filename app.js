const moment = require('moment');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
const mongoose = require('mongoose');
const flash    = require('connect-flash');
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var db = require('./db');
var express = require('express'),
    app = module.exports.app = express();

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
server.listen(process.env.PORT || 3000);



var configDB = require('./config/db.js');
 require('./config/passport')(passport);


mongoose.connect(configDB.MONGODB_URI,{
  useMongoClient: true,
  /* other options */
});





app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname+ '/public'));


app.use(require('cookie-parser')());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
app.use(session({
	// store: new RedisStore({}),
  	secret: 'IfocopIsMagic',
  	resave: true,
  	saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session({secret:'IfocopIsMagic'})); // persistent login sessions
app.use(flash());


// routes
var site = require('./routes/site');

// Removed this route because i was unable to export io to access it in my router file so i moved it at the end of this file.
// var chat = require('./routes/chat')(app,io);

app.use("/", site);





// |¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|
// |------------------------ Chat -------------------------|
// |_________________________________________________________|

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









// old express-session
// app.use(session({
//   	secret: 'IfocopIsMagic',
//   	resave: true,
//   	saveUninitialized: true,
//   	cookie:{
//     	secure: true
//     },
// 	store: new RedisStore()
// }));



//passport init
// app.use(session({ secret: 'IfocopIsMagic' })); // session secret







// app.use("/chat", chat);




// a voir si besoin.
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });




app.get('/ping',  function(req, res) {
  res.status(200).json('OK');
});


app.get('*',  function(req, res) {
  res.render('404');
});



// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });
