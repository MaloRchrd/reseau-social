const express = require('express');
// const proxyMiddleware = require('http-proxy-middleware');
const moment = require('moment');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const port     = process.env.PORT || 3000;

const mongoose = require('mongoose');
const flash    = require('connect-flash');
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

// old
var db = require('./db');
// const mongo = require('./db'); // old withour mongoose

const app = express();

// const io = require('socket.io');
// var ioServer = io(server);




var configDB = require('./config/db.js');
 require('./config/passport')(passport);


mongoose.connect(configDB.url,{
  useMongoClient: true,
  /* other options */
});

// require('./config/passport')(passport); // pass passport for configuration


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname+ '/public'));


app.use(require('cookie-parser')());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

// old express-session
app.use(require('express-session')({
  secret: 'IfocopIsMagic',
  resave: true,
  saveUninitialized: true
}));


//passport init
// app.use(session({ secret: 'IfocopIsMagic' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());





// routes
var site = require('./routes/site');
var chat = require('./routes/chat');

app.use("/", site);
app.use("/chat", chat);


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

app.listen(port);
