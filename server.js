// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var PORT = process.env.PORT || 8000;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');


//logger 
var morgan = require('morgan');
//cookies we store on the computer
var cookieParser = require('cookie-parser');
// able to look at elements that come across the request
var bodyParser = require('body-parser');
// allows to keep a open session for the user (stay logged in)
var session = require('express-session');
var configDB = require('./config/database.js');
var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
    if (err) return console.log(err)
    db = database
    require('./app/routes.js')(app, passport, db);
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))



app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(PORT);
console.log('Running on port ' + PORT);
