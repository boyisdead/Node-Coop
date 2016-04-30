// set up ======================================================================
var express  = require('express');
var app      = express();  // create our app w/ express

var bodyParser = require('body-parser');
var morgan   = require('morgan');
var mongoose = require('mongoose'); 					// mongoose for mongodb

var database = require('./config/database'); 			// load the database config
var authToken = require('./config/authenticate');
var hashKey = require('./config/security');
//var uuid = require('uuid');
var multiparty = require('multiparty');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'			// set the port
var methodOverride = require('method-override');

var mkdirp = require('mkdirp');
mkdirp('./public/uploads/attachments', function(err) {
	if (err) console.error(err)
    else console.log('Attachment directory created!')
});
mkdirp('./public/uploads/dlcs', function(err) {
	if (err) console.error(err)
    else console.log('Downloadable Content directory created!')
});
mkdirp('./public/uploads/pictures/profile', function(err) {
	if (err) console.error(err)
    else console.log('Profile Picture directory created!')
});
mkdirp('./public/uploads/pictures/company', function(err) {
	if (err) console.error(err)
    else console.log('Company Picture directory created!')
});

// configuration ===============================================================
// //provide a sensible default for local development
mongodb_connection_string = database.url + database.name;
//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + database.name;
}
mongoose.connect(mongodb_connection_string); 	// connect to mongoDB 
app.set('secretToken',authToken.secret);
app.set('secretHash',hashKey.key);
app.set('expireTime',authToken.exp_time);
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(server_port, server_ip_address);
console.log("App listening on " + server_ip_address + ", server_port " + server_port);
