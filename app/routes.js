module.exports = function (app, passport, db) {

    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function (req, res) {
        let user = req.user
        db.collection('posts').find({ postedBy: user.local.username }).toArray((err, result) => {
            db.collection('comments').find().toArray((err, mainResult) => {

                if (err) return console.log(err)
                res.render('profile.ejs', {
                    user: req.user,
                    posts: result,
                    comments: mainResult
                })
            })
        })
    });
    // app.get('/settings', (req, res) => {
    //     res.render('settings.ejs')
    // })
    // IMAGE UPLOADING
    // app.post("/profile", upload.single("file-to-upload"), async (req, res) => {
    //     try {
    //         // Upload image to cloudinary
    //         const result = await cloudinary.uploader.upload(req.file.path);
    //         const objectURL = result.secure_url;
    //         res.render("result.ejs", { count: hotDogCount, img: objectURL });
    //     } catch (err) {
    //         console.log(err);
    //     }
    // })

    // INTERACTIVE MAP ========================
    app.get('/map', isLoggedIn, (req, res) => {
        res.render('map.ejs', { user: req.user })
    })

    app.get('/add', (req, res) => {
        res.render('add.ejs')
    })


    app.post('/messages', (req, res) => {
        db.collection('messages').save({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 /*, postedBy: req.user._id*/ }, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('/profile')
        })
    })


    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
