// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});


	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/preference', // redirect to the secure preference section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)

	app.get('/profile', isLoggedIn, function(req, res) {
        var userViewSet = getUserViewSet(req);
		res.render('profile.ejs', {
			user : userViewSet // get the user out of session and pass to template
		});
	});

	app.get('/preference', isLoggedIn, function(req, res) {
        var userViewSet = getUserViewSet(req);
		res.render('preference.ejs', {
			user : userViewSet // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.session.destroy(function (err) {
			res.redirect('/'); //Inside a callback… bulletproof!
		});
	});

    app.route("/login/facebook").get(
        passport.authenticate("facebook")
    );

    app.route("/auth/facebook/callback").get(
        passport.authenticate("facebook", {
            successRedirect : '/profile',
            failureRedirect : '/'
        })
    );
    
    
// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================

    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

function getUserViewSet(req) {
    var userViewSet = {
        name: req.user.dataValues.username,
        email: req.user.dataValues.username,
        facebook_id: undefined,
        isFacebook: false
    };
    let isFacebook = req.user.dataValues.facebook_id.length > 0;
    console.log("isFacebook: " + isFacebook);
    if (isFacebook) {
        console.log("got hurr");
        userViewSet.name = req.user.dataValues.name;
        userViewSet.email = req.user.dataValues.email;
        userViewSet.facebook_id = req.user.dataValues.facebook_id;
        userViewSet.isFacebook = true;
    }
    return userViewSet;
}
