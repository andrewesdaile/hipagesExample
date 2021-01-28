//var assert = require('assert');
var express = require('express');
var selectJobs = require('./service.selectJobs');
var updateJob = require('./service.updateJob');

var server = express();
var port = 8080;

server.listen(port, () =>
{
	console.log(`Server is listening at http://localhost:${port}`);
});

//define a page route handler for the microservices
server.get('/', (req, res) =>
{
	try
	{
		//add access control headers to prevent issues for the React code
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		res.setHeader('Access-Control-Allow-Credentials', 'true');

		//available actions are: newJobs, acceptedJobs, updateJob
		let id = (req.query.id ? req.query.id : 0);
		let action = req.query.action;
		let status = req.query.status;

		console.log(`${id} / ${action} / ${status}`);
		//assert.match('action', /selectJobs|updateJob/);

		var service = selectJobs;

		if (action === 'updateJob')
			service = updateJob;

		service.executeQuery(id, status, function(data)
		{
			//console.log(`JSON.stringify(data)=${JSON.stringify(data)}`);
			res.json({ result_code: data.code, result_data: data.result });
		});
	}
	catch (ex)
	{
		res.json({ result_code: '1', result_data: 'Processing failed due to a server error. Please contact support.', result_exception: ex.message });
		//TODO: send the error to slack etc.
	}
});
