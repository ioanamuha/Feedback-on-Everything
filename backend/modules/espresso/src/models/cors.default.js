const CORS_DEFAULT_OPTIONS = Object.freeze({
	origin: "*",
	methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS", "HEAD"],
	headers: "Content-Type,Authorization",
	credentials: "false",
});

module.exports = CORS_DEFAULT_OPTIONS;
