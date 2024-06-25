const BodyParser = async (request, response, next) => {
	let body = [];

	for await (const chunk of request) {
		body.push(chunk);
	}

	body = Buffer.concat(body).toString();

	if (request.headers["content-type"] === "application/json") {
		request.body = JSON.parse(body);
	} else if (
		request.headers["content-type"] === "application/x-www-form-urlencoded"
	) {
		let params = new URLSearchParams(body);
		let entries = params.entries();
		request.body = Object.fromEntries(entries);
	}

	next();
};

module.exports = BodyParser;
