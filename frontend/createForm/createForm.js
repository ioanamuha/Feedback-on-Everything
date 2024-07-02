const API_CREATE_FORM = "http://127.0.0.1:3000/api/v1/form/create";
const API_USER_CONTROLLER = "http://127.0.0.1:3000/api/v1/users/";

function redirectToMainPage() {
	window.location.href = "../mainPage/main.html";
}

async function create(event) {
	event.preventDefault();
	document.getElementById("create-error").style.display = "none";

	const data = new FormData(event.target);
	const isAnonymous = data.get("anonym") ? true : false;
	const firstName = !isAnonymous ? data.get("first-name") : "";
	const lastName = !isAnonymous ? data.get("last-name") : "";
	const title = data.get("form-title") || "";
	const description = data.get("form-description").trim() || "";
	const category = data.get("form-category") || "";
	const formPhoto = data.get("form-photo") || undefined;

	if (
		!title ||
		!description ||
		!category ||
		(!isAnonymous && (!firstName || !lastName))
	) {
		document.getElementById("create-error").style.display = "block";
		return;
	}

	const currentUserEmail = JSON.parse(localStorage.getItem("user")).email;
	const authToken = JSON.parse(localStorage.getItem("user")).token;

	const createBody = {
		email: currentUserEmail,
		title: title,
		description: description,
		category: category,
		anonymous: isAnonymous,
		firstName: firstName,
		lastName: lastName,
	};

	const response = await fetch(API_CREATE_FORM, {
		method: "POST",
		body: JSON.stringify(createBody),
		headers: {
			authorization: "Bearer " + authToken,
			"Content-Type": "application/json",
		},
	});

	if (response.status !== 200) {
		document.getElementById("create-error").style.display = "block";
		return;
	}

	redirectToMainPage();
}

async function initPage() {
	document.getElementById("create-error").style.display = "none";
	const savedCurrentUser = localStorage.getItem("user");
	if (!savedCurrentUser) {
		window.location.href = "../index.html";
		return;
	}

	const currentUserEmail = JSON.parse(savedCurrentUser).email;
	const authToken = JSON.parse(savedCurrentUser).token;

	const response = await fetch(API_USER_CONTROLLER + currentUserEmail, {
		headers: {
			authorization: "Bearer " + authToken,
		},
	});

	if (response.status !== 200) {
		document.getElementById("first-name").value = "";
		document.getElementById("last-name").value = "";
		return;
	}

	const resData = await response.json();
	document.getElementById("first-name").value = resData.user.firstName;
	document.getElementById("last-name").value = resData.user.lastName;

	const form = document.getElementById("form-builder");
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		create(event);
	});
}

initPage();
