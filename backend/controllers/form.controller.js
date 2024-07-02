const { FormModel, FeedbackModel, UserFormsModel } = require("../database/models");
const { AuthMiddleware } = require("../middlewares");
const { PLUTCHIK_EMOTIONS } = require("../utils/plutchick");

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

    console.log(typeof formData.anonymous);
	const newForm = new FormModel({
		anonymous: formData.anonymous,
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

router.get("/form/:formId", async (req, res) => {
    const formId = req.params.formId;

    try {
        const form = await FormModel.findById(formId);

        if (!form) {
            return res.status(404).json({
                statusCode: 404,
                message: "Form not found",
            });
        }

        res.status(200).json({
            statusCode: 200,
            message: "Form found",
            form: {
                id: form._id,
                title: form.title,
                description: form.description,
                anonymous: form.anonymous,
                firstName: form.firstName,
                lastName: form.lastName,
                category: form.category
            }
        });
    } catch (error) {
        console.error("Error fetching form:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Error fetching form",
        });
    }
});

router.get("/forms/all", async (req, res) => {
    try {
        const allForms = await FormModel.find({});
        
        const formData = allForms.map(form => ({
            id: form._id,
            image: form.photo || "",
            title: form.title || "",
            anonymous: form.anonymous,
            firstName: form.firstName || "",
            lastName: form.lastName || "",
            description: form.description || "",
        }));

        res.status(200).json({
            statusCode: 200,
            message: "All forms retrieved successfully",
            forms: formData,
        });
    } catch (error) {
        console.error("Error retrieving all forms:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Error retrieving forms",
        });
    }
});

router.get("/form/statistics/:formId", async (req, res) => {
    const formId = req.params.formId;

    try {
        const form = await FormModel.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        const responses = await FeedbackModel.find({ formId: formId });

        const emotions = {};
        const textResponses = [];

        responses.forEach(response => {
            emotions[response.emotion] = (emotions[response.emotion] || 0) + 1;
            textResponses.push({
                emotion: response.emotion,
                feedback: response.feedback,
                createdAt: response.createdAt
            });
        });

        res.json({
            formTitle: form.title,
            totalResponses: responses.length,
            emotions: emotions,
            textResponses: textResponses
        });
    } catch (error) {
        console.error("Error fetching form statistics:", error);
        res.status(500).json({ message: "Error fetching statistics" });
    }
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
				id: savedForm._id.toString() || "",
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

router.post("/form/submit-feedback", async (req, res) => {
	const { formId, emotion, feedback } = req.body;
  
	if (!formId || !emotion || !feedback) {
	  return res.status(400).json({
		statusCode: 400,
		message: "Missing required fields",
	  });
	}
  
	if (!Object.values(PLUTCHIK_EMOTIONS).some(e => e.name === emotion)) {
	  return res.status(400).json({
		statusCode: 400,
		message: "Invalid emotion",
	  });
	}
  
	try {
	  const form = await FormModel.findById(formId);
	  if (!form) {
		return res.status(404).json({
		  statusCode: 404,
		  message: "Form not found",
		});
	  }
  
	  const newResponse = new FeedbackModel({
		formId,
		emotion,
		feedback
	  });
  
	  await newResponse.save();
  
	  res.status(201).json({
		statusCode: 201,
		message: "Feedback submitted successfully",
	  });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({
		statusCode: 500,
		message: "Error submitting feedback",
	  });
	}
});

router.useAll(AuthMiddleware);

module.exports = router;