// set up ======================================================================
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const multer = require('multer');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// load env vars
// dotenv.config({ path: './config/config.env' })
const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    },
});

//cloudinary


const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./config/database.js');
let db;

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
    if (err) return console.log(err)
    db = database;
    require('./app/routes.js')(app, passport, db, multer, ObjectId);
    require('./config/passport')(passport, db); // pass passport for configuration
}); // connect to our database

// set up our express application
// app.use(morgan('dev')); // log every request to the console
app.use(cors());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(express.json());
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/api/v1/services', require('./routes/services'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'weCare', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
