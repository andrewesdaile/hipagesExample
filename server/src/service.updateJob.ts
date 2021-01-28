
exports.executeQuery = (id, status, callback) =>
{
	var assert = require('assert');
	var mysql = require('mysql');
	var config = require('./config');
	var queryJobs = require('./query.updateJob');

	try
	{
		const query = queryJobs.getQuery(id, status);

		assert.notEqual(query, null);
		assert.notEqual(query, "");
		//console.log(query);

		var connection = mysql.createConnection(config);

		//console.log(JSON.stringify(config));
		assert.notEqual(connection, null);

		connection.query(query, (error, result, fields) =>
		{
			if (error)
			{
				console.log(error);
				//TODO: send the error to slack etc.
				return;
			}

			//console.log(result);
			callback({ code: 0, result: result });
		});
	}
	catch (ex)
	{
		return({ code: 1, result: 'An error occurred fetching job data.' });
		console.error(ex);
		//TODO: send the error to slack etc.
	}
};
