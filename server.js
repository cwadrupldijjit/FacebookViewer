var express = require('express'),
	session = require('express-session'),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	FacebookStrategem = require('passport-facebook').Strategy,
	config = require('./node_config'),
	port = config.port;

passport.use(new FacebookStrategem({
	clientID: config.clientID,
	clientSecret: config.clientSecret,
	callbackURL: 'http://localhost:8979/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
	console.log('token', token);
	console.log('profile', profile);
	return done(null, profile);
}));

var app = express();

app.use(express.static(__dirname + 'public'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: config.sessionSecret}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

function requireAuth(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.redirect('/login');
}



app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/me',
	failureRedirect: '/login'
}), function(req, res) {
	console.log(req.session);
});

app.get('/me', requireAuth, function(req, res) {
	res.send(req.user);
});


app.listen(port, function() {
	console.log('Express app running at http://localhost:%s', port);
});