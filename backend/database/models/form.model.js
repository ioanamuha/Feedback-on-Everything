const { Schema, model } = require("mongoose");

const formSchema = new Schema({
	anonymous: {
		type: Boolean,
		required: true,
	},
	firstName: {
		type: String,
		required: false,
	},
	lastName: {
		type: String,
		required: false,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	photo: {
		type: String,
		required: false,
	},
	// emotion: {
	// 	type: String,
	// 	required: false, 
	//   },
});

module.exports = model("forms", formSchema);
