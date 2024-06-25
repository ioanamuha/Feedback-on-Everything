const { Schema, model } = require("mongoose");

const userFormSchema = new Schema({
	_id: {
		type: String,
		required: true,
	},
	formIds: [String],
});

module.exports = model("user-forms", userFormSchema);
