var express = require('express'),
	session = require('express-session'),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	FacebookStrategem = require('passport-facebook').Strategy,
	config = require('node_config'),
	port = 8979;

var app = express();

app.use(express.static(__dirname));
app.use(cors());
app.use(bodyParser.json());
app.use(session({secret: config.sessionSecret}))
app.use(passport.initialize());

passport.use(new FacebookStrategem({
	clientID: config.clientID,
	clientSecret: config.clientSecret,
	callbackURL: 'http://localhost:8979/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
	
}));



app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/',
	failureRedirect: '/login'
}), function(req, res) {
	console.log(req.session);
});


app.listen(port, function() {
	console.log('Express app running at http://localhost:%s', port);
})