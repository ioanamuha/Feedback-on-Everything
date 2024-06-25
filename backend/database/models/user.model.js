const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	_id: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: String,
		required: false,
	},
});

module.exports = model("users", userSchema);
