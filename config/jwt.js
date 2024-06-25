module.exports = {
	SECRET_KEY: process.env.JWT_KEY || "supersecretkey",
	EXPIRE_TIME: process.env.JWT_EXPIRE_TIME_STRING || "1h",
};
