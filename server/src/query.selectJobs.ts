
exports.getQuery = (id, status) =>
{
	var query = `
	SELECT
		A.id,
		status,
		B.name AS category,
		C.name AS suburb,
		C.postcode AS postcode,
		contact_name,
		contact_phone,
		contact_email,
		price,
		description,
		date_format(created_at, '%M %d %Y @ %h:%i %p') as created_at,
		date_format(updated_at , '%M %d %Y @ %h:%i %p') as updated_at
	FROM
		jobs A 
	LEFT JOIN
		categories B 
	ON
		A.category_id = B.id 
	LEFT JOIN
		suburbs C 
	ON
		A.suburb_id = C.id 
	WHERE
		status = '${status}'
	`;

	return query;
};
