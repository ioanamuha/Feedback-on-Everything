const { CORS_DEFAULT_OPTIONS } = require("../models");

const Cors = (options) => {
	const configureOrigin = async (request) => {
		if (
			!options ||
			options.origin === undefined ||
			options.origin === "*" ||
			options.origin.includes("*")
		) {
			return true;
		}

		if (Array.isArray(options.origin)) {
			return options.origin.includes(request.headers.host);
		}

		if (typeof options.origin === "string") {
			return options.origin === request.headers.host;
		}

		if (typeof options.origin === "function") {
			return await options.origin(request.headers.host);
		}

		return false;
	};

	const configureMethod = (request) => {
		if (!options || options.method === undefined) {
			options.method = CORS_DEFAULT_OPTIONS.methods;
		}

		if (
			typeof options.methods === "string" &&
			options.methods === request.method
		) {
			return options.methods;
		}

		if (
			Array.isArray(options.method) &&
			options.method.includes(request.method)
		) {
			return request.method;
		}

		return null;
	};

	const cors = async (request, response, next) => {
		const origin = await configureOrigin(request);
		if (origin === false) return;

		response.setHeader("Access-Control-Allow-Origin", "*");

		const method = configureMethod(request);
		response.setHeader("Access-Control-Allow-Methods", method ?? "*");

		response.setHeader(
			"Access-Control-Allow-Headers",
			options.headers ? options.headers : CORS_DEFAULT_OPTIONS.headers
		);
		response.setHeader(
			"Access-Control-Request-Headers",
			CORS_DEFAULT_OPTIONS.headers
		);
		response.setHeader(
			"Access-Control-Allow-Credentials",
			CORS_DEFAULT_OPTIONS.credentials
		);

		next();
	};

	return cors;
};

module.exports = Cors;
