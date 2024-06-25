const { sign, verify } = require("jsonwebtoken");

const { JWT_SECRETS } = require("../config");

exports.createJWT = (data) => {
	return sign({ email: data }, JWT_SECRETS.SECRET_KEY, {
		expiresIn: "1h",
	});
};

exports.validateJWT = (token) => {
	return verify(token, JWT_SECRETS.SECRET_KEY, (err, decoded) => {
		return !err;
	});
};
