const { UserModel } = require("../database/models");
const { AuthMiddleware } = require("../middlewares");

const router = require("espresso").Router();

router.get("/users/:id", async (req, res) => {
	const id = req.params?.id;

	if (!id) {
		return res.status(404).json({
			message: "User not found",
			statusCode: 404,
		});
	}

	const savedUser = await UserModel.findById(id);
	if (!savedUser) {
		return res.status(404).json({
			message: "User not found",
			statusCode: 404,
		});
	}

	res.status(200).json({
		user: {
			email: savedUser.id,
			firstName: savedUser.firstName,
			lastName: savedUser.lastName,
			phoneNumber: savedUser.phoneNumber,
		},
		statusCode: 200,
		message: "User found",
	});
});

router.patch("/users/:id", async (req, res) => {
	const id = req.params?.id;
	const firstName = req.body?.firstName || undefined;
	const lastName = req.body?.lastName || undefined;
	const phoneNumber = req.body?.phoneNumber || undefined;

	if (!id || !firstName || !lastName) {
		return res.status(400).json({
			message: "Bad request. Update failed",
			statusCode: 400,
		});
	}

	const user = await UserModel.findByIdAndUpdate(id, {
		firstName: firstName,
		lastName: lastName,
		phoneNumber: phoneNumber ?? "",
	});

	if (!user) {
		return res.status(400).json({
			message: "Bad request. Update failed",
			statusCode: 400,
		});
	}

	res.status(200).json({
		message: "User successfully updated!",
		statusCode: 200,
	});
});

router.useAll(AuthMiddleware);

module.exports = router;
