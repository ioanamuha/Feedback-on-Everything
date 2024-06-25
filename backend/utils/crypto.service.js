const { randomBytes, pbkdf2Sync } = require("crypto");

exports.createHash = (value) => {
	const salt = randomBytes(32).toString("hex");
	const genHash = pbkdf2Sync(value, salt, 1000, 64, "sha512").toString("hex");
	return `${genHash}.${salt}`;
};

exports.compareHash = (storedValue, givenValue) => {
	const storedHash = storedValue.split(".")[0] || "";
	const salt = storedValue.split(".")[1] || "";
	const givenValueHash = pbkdf2Sync(
		givenValue,
		salt,
		1000,
		64,
		"sha512"
	).toString("hex");
	return givenValueHash === storedHash;
};
