var express = require('express');
var mongodb = require('mongodb');
var moment = require('moment');
var app = express();

var uri = 'mongodb://038353256:b05210523@ds023105.mlab.com:23105/db_iremind';
var database;

mongodb.MongoClient.connect(uri, function(err, db) {
	if (err) {
		console.log('connect mongo db error ' + err);
	} else {
		console.log('connect mongo db success');
		database = db;
	}
});

app.get('/api/inputlocation', function(request, response) {
	if (!request.query.value) {
		__sendErrorResponse(response, 403, 'No query parameters value');
		return;
	}

	var startway;
	var endway;
	var car_number
	var str = request.query.value;
	var WayArray = new Array();
	var WayArray = str.split(",");

	var insert ={
		startway : WayArray[0],
		endway : WayArray[1],
		car_number : WayArray[2]

	};

	var items = database.collection('dbforlineplan');

	items.insert(insert, function(err, result) {
					if (err) {
					__sendErrorResponse(response, 406, err);
					} else {
						response.type('application/json');
						response.status(200).send("路線輸入完成!!");
						response.end();
					}
				});
	
});


app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.listen(process.env.PORT || 5000);
console.log('port ' + (process.env.PORT || 5000));

function __sendErrorResponse(response, code, content) {
	var ret = {
		err: code,
		desc : content 
	};
	response.status(code).send(ret);
	response.end();
}