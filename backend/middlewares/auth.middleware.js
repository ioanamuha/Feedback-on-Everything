const { JWT } = require("../utils");

const AuthMiddleware = (request, response, next) => {
	if (request.method === "OPTIONS") {
		return next();
	}

	if (!request.token || !JWT.validateJWT(request.token)) {
		return response
			.status(401)
			.send("Not authenticated. Authorization header is missing");
	}

	next();
};

module.exports = AuthMiddleware;
