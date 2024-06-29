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
	// Implementați logica pentru toggle anonym dacă este necesar
}

async function submitFeedback(event) {
	document.getElementById("submit-error").style.display = "none";

	const data = new FormData(event.target);
	const feedbackText = data.get("feedback-text") || "";
	const isAnonymous = data.get("anonym") || false;

	if (!selectedEmotion || !feedbackText) {
		document.getElementById("submit-error").style.display = "block";
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

	const response = await fetch(API_SUBMIT_FEEDBACK, {
		method: "POST",
		body: JSON.stringify(submitBody),
		headers: {
			authorization: "Bearer " + authToken,
			"Content-Type": "application/json",
		},
	});

	if (response.status !== 201) {
		document.getElementById("submit-error").style.display = "block";
		return;
	}

	redirectToMainPage();
}

async function loadFormData() {
	const formId = new URLSearchParams(window.location.search).get('formId');
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

	const formData = await response.json();
	document.getElementById("form-description").textContent = formData.description;
	document.getElementById("user-info").textContent = formData.anonymous ? "by Anonymous User" : `by ${formData.firstName} ${formData.lastName}`;
}

async function initPage() {
	document.getElementById("submit-error").style.display = "none";
	const savedCurrentUser = localStorage.getItem("user");
	if (!savedCurrentUser) {
		window.location.href = "../index.html";
		return;
	}

	await loadFormData();

	const form = document.getElementById("feedback-form");
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		submitFeedback(event);
	});
}

initPage();