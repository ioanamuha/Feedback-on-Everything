const { FormModel, UserFormsModel } = require("../database/models");
const { AuthMiddleware } = require("../middlewares");

const router = require("espresso").Router();

router.post("/form/create", async (req, res) => {
	const formData = req.body;
	if (
		!formData ||
		!formData.email ||
		!formData.title ||
		!formData.description ||
		!formData.category ||
		formData.anonymous === undefined ||
		formData.anonymous === null
	) {
		return res.status(400).json({
			statusCode: 400,
			message: "Failed to create feedback form",
		});
	}

	const newForm = new FormModel({
		anonymous: formData.anonymous == "true" ? true : false,
		title: formData.title,
		description: formData.description,
		category: formData.category,
		firstName: formData.anonymous ? "" : formData.firstName,
		lastName: formData.anonymous ? "" : formData.lastName,
	});
	const savedNewForm = await newForm.save();

	const user = await UserFormsModel.findById(formData.email);
	if (!user) {
		const formInUserForms = new UserFormsModel({
			_id: formData.email,
			formIds: [savedNewForm._id],
		});
		await formInUserForms.save();
	} else {
		const updatedUserForms = await UserFormsModel.findByIdAndUpdate(
			formData.email,
			{
				$push: { formIds: savedNewForm._id },
			},
			{ new: true }
		);
		if (!updatedUserForms) {
			return res.status(400).json({
				statusCode: 400,
				message: "Failed to create feedback form",
			});
		}
	}

	res.status(200).json({
		statusCode: 200,
		message: "Feedback form created successfully",
	});
});

router.get("/form/available-forms/:currentUser", async (req, res) => {
	const currentUser = req.params?.currentUser;
	if (!currentUser) {
		return res.status(400).json({
			statusCode: 400,
			message: "No current user",
		});
	}

	const userForms = await UserFormsModel.findById(currentUser);
	if (!userForms) {
		return res.status(404).json({
			statusCode: 404,
			message: "Current user not found",
		});
	}

	const availableForms = [];
	const promises = userForms.formIds.map(async (formId) => {
		const savedForm = await FormModel.findById(formId);

		if (savedForm) {
			availableForms.push({
				image: savedForm.photo || "",
				title: savedForm.title || "",
				anonymous: savedForm.anonymous,
				firstName: savedForm.firstName || "",
				lastName: savedForm.lastName || "",
				description: savedForm.description || "",
			});
		}
	});

	await Promise.all(promises);

	if (availableForms.length === 0) {
		return res.status(404).json({
			statusCode: 404,
			message: "No available forms found",
		});
	}

	res.status(200).json({
		statusCode: 200,
		message: "Available forms found",
		forms: availableForms,
	});
});

router.useAll(AuthMiddleware);

module.exports = router;
