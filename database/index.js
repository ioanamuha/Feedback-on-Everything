const mongoose = require("mongoose");
const { DB_SECRETS } = require("../config");

const DB_URI = DB_SECRETS.URI;

module.exports = {
	connect: async () => {
		return mongoose.connect(DB_URI);
	},
};
