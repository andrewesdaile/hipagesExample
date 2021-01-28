
exports.getQuery = (id, status) =>
{
	var query = `
	UPDATE
		jobs
	SET
		status = '${status}'
	WHERE
		id = ${id}
	`;

	return query;
};
