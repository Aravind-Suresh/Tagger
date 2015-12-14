var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*app.use(multer({
	dest: './public/uploads/',
	onFileUploadComplete: function (file) {
		console.log(file.fieldname + ' uploaded to  ' + file.path);
	}
}));
*/

var mongoose = require("mongoose");
var db = mongoose.connection;

var settings = require("./settings");
db.open('mongodb://'+settings.db.mongo.username+":"+settings.db.mongo.password+"@"+settings.db.mongo.host+'/'+settings.db.mongo.name);

var Models = require("./models");
var _ = require("underscore");
var Q = require("q");

app.post('/tag', function (req, res) {
	debugger;
	var Thing = Models.Thing;
	var params = req.body;
	var keys = _.pluck(params.data, "filename");

	debugger;

	Thing.remove({ key : {
		$in : keys
	}}).exec().then(function(result) {
		debugger;
		for(var i=0; i<params.data.length; ++i) {
			var ele = params.data[i];
			debugger;
			var thing = new Thing({ key : ele.filename, tags : ele.tags });
			thing.save();
		}

		debugger;
		res.end(JSON.stringify({ result : true }));
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});


module.exports = app;
