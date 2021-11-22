// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var PORT = process.env.PORT || 8000;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
//required for video call
const { v4: uuidv4 } = require("uuid");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

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
//video call requirements
app.use("/peerjs", peerServer);


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

//required for video call ======================================================================
io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
    });
});

app.get("/room", (req, res) => {
    res.redirect(`/roomid/${uuidv4()}`);
});
app.get("/roomid/:room", (req, res) => {
    res.render('room', { roomId: req.params.room });
});


// launch ======================================================================
app.listen(PORT);
console.log('Running on port ' + PORT);
