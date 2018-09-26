// server.js
require("dotenv").config();

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var exphbs = require("express-handlebars");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require("path");
var app      = express();
var port     = process.env.PORT || 8080;

var passport = require('passport');
var flash    = require('connect-flash');

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'rouleats',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// link server routing data
require("./routes/api")(app);
require("./routes/html")(app, path);
require('./routes/login.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.use(express.static(__dirname + '/public'));

// launch ======================================================================
app.listen(port);
console.log('Listening on port ' + port);
