const espresso = require("espresso");
require("dotenv").config();

const { BodyParser, Cors } = require("espresso/src/middlewares");
const { connect } = require("./database");

const { AuthRouter, UserRouter, FormRouter } = require("./controllers");

const BASE_URL = process.env.BASE_URL || "/api/v1";
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

const app = espresso();

app.useAll(BodyParser);
app.useAll(Cors({}));

app.useRouter(BASE_URL, AuthRouter);
app.useRouter(BASE_URL, UserRouter);
app.useRouter(BASE_URL, FormRouter);

connect()
	.then(() => {
		console.log("database successfully connected");

		const start = async () => {
			app.run(PORT, HOSTNAME);
		};

		start();
	})
	.catch((err) => {
		console.log("Error on database connection: " + err);
	});
