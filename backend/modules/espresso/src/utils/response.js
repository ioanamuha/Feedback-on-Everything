const ResponseDecorator = (request, response, next) => {
	response.status = (status) => {
		response.statusCode = status;
		return response;
	};

	response.json = (data) => {
		response.setHeader("Content-type", "application/json");
		response.end(JSON.stringify(data));
	};

	response.send = async (data) => {
		response.end(data);
	};

	// Our signature :)
	response.setHeader("X-Powered-By", "espresso");

	next();
};

module.exports = ResponseDecorator;
