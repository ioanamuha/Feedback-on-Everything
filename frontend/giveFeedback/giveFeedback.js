const API_SUBMIT_FEEDBACK = "http://127.0.0.1:3000/api/v1/form/submit-feedback";
const API_GET_FORM = "http://127.0.0.1:3000/api/v1/form/";

function redirectToMainPage() {
	window.location.href = "../mainPage/main.html";
}

let selectedEmotion = null;

function selectEmotion(emotion) {
	selectedEmotion = emotion;
	document.querySelectorAll('.emoji').forEach(img => {
		img.style.border = img.alt === emotion ? '2px solid blue' : 'none';
	});
}

function toggleAnonym() {
}

async function submitFeedback(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const feedbackText = data.get("feedback-text") || "";
    const isAnonymous = data.get("anonym") || false;

    if (!selectedEmotion || !feedbackText) {
        return;
    }

    const formId = localStorage.getItem("currentFormId");
    const authToken = JSON.parse(localStorage.getItem("user")).token;

    const submitBody = {
        formId: formId,
        emotion: selectedEmotion,
        feedback: feedbackText,
        anonymous: isAnonymous
    };

    console.log("Submitting feedback:", submitBody);

    try {
        const response = await fetch(API_SUBMIT_FEEDBACK, {
            method: "POST",
            body: JSON.stringify(submitBody),
            headers: {
                authorization: "Bearer " + authToken,
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 201) {
            console.error("Failed to submit feedback. Status:", response.status);
            return;
        }

        console.log("Feedback submitted successfully");

        redirectToMainPage();
    } catch (error) {
        console.error("Error submitting feedback:", error);
    }
}

async function loadFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('form-id');
	if (!formId) {
		console.error("No form ID provided");
		return;
	}

	localStorage.setItem("currentFormId", formId);
	const authToken = JSON.parse(localStorage.getItem("user")).token;

	const response = await fetch(API_GET_FORM + formId, {
		headers: {
			authorization: "Bearer " + authToken,
		},
	});

	if (response.status !== 200) {
		console.error("Failed to load form data");
		return;
	}

	const formData = (await response.json()).form;
    console.log(formData);
	document.getElementById("form-description").textContent = formData.description;
	document.getElementById("user-info").textContent = formData.anonymous ? "by Anonymous User" : `by ${formData?.firstName ?? ''} ${formData?.lastName ?? ''}`;
}

async function initPage() {
	const savedCurrentUser = localStorage.getItem("user");
	if (!savedCurrentUser) {
		window.location.href = "../index.html";
		return;
	}

	await loadFormData();

	const form = document.getElementById("form-builder");
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		submitFeedback(event);
	});
}

initPage();
