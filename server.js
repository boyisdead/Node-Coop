// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var bodyParser = require('body-parser');
var morgan   = require('morgan');
var mongoose = require('mongoose'); 					// mongoose for mongodb

var database = require('./config/database'); 			// load the database config
var authToken = require('./config/authenticate');


var port  	 = process.env.PORT || 8080; 				// set the port
var methodOverride = require('method-override');

// configuration ===============================================================
mongoose.connect(database.url); 	// connect to mongoDB 
app.set('secretToken',authToken.secret);

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
