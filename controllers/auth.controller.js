const { UserModel } = require("../database/models");
const { CryptoHelper, JWT } = require("../utils");

const router = require("espresso").Router();

router.post("/login", async (req, res) => {
	const email = req.body?.email || undefined;
	const password = req.body?.password || undefined;

	if (!email || !password) {
		return res.status(400).json({
			message: "Not authorized. Wrong credentials",
			statusCode: 400,
		});
	}

	// check if user exists in db
	const savedUser = await UserModel.findById(email);
	if (!savedUser) {
		return res.status(400).json({
			message: "Not authorized. Wrong credentials",
			statusCode: 400,
		});
	}

	// check if given password matches with the one in the db
	const storedPassword = savedUser.password;
	if (!CryptoHelper.compareHash(storedPassword, password)) {
		return res.status(400).json({
			message: "Not authorized. Wrong credentials",
			statusCode: 400,
		});
	}

	const token = JWT.createJWT(email);
	return res.status(200).json({
		token: token,
		message: "Successfully authorized",
		statusCode: 200,
	});
});

router.post("/signup", async (req, res) => {
	const firstName = req.body?.firstName || undefined;
	const lastName = req.body?.lastName || undefined;
	const email = req.body?.email || undefined;
	const password = req.body?.password || undefined;

	if (!firstName || !lastName || !email || !password) {
		return res.status(400).json({
			message: "Bad request. Try again to signup",
			statusCode: 400,
		});
	}

	// check if email already exists
	const savedUser = await UserModel.findById(email);
	if (savedUser) {
		return res.status(400).json({
			message: "Email already registered. Try with another",
			statusCode: 400,
		});
	}

	const hashPassword = CryptoHelper.createHash(password);
	const newUser = new UserModel({
		_id: email,
		password: hashPassword,
		firstName: firstName,
		lastName: lastName,
	});
	await newUser.save();

	return res.status(201).json({
		message: "User successfully created",
		statusCode: 201,
	});
});

module.exports = router;
