const API_BASE_URL = "http://127.0.0.1:3000/api/v1/signup";

function redirectToLoginPage() {
	window.location.href = "../index.html";
}

async function register(event) {
	document.getElementById("input-fields-error").style.display = "none";
	document.getElementById("register-error").style.display = "none";
	document.getElementById("password-error").style.display = "none";

	const data = new FormData(event.target);
	const firstName = data.get("firstName") || "";
	const lastName = data.get("lastName") || "";
	const email = data.get("email") || "";
	const password = data.get("password") || "";
	const confirmPassword = data.get("confirm-password") || "";

	console.log(password);
	console.log(confirmPassword);
	if (!email || !firstName || !lastName || !password || !confirmPassword) {
		document.getElementById("input-fields-error").style.display = "block";
		return;
	}

	if (confirmPassword !== password) {
		document.getElementById("password-error").style.display = "block";
		return;
	}

	const requestData = {
		email: email,
		password: password,
		firstName: firstName,
		lastName: lastName,
	};

	fetch(API_BASE_URL, {
		mode: "cors",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestData),
	})
		.then((res) => {
			if (res.status !== 201) {
				document.getElementById("register-error").style.display =
					"block";
				return;
			}

			redirectToLoginPage();
		})
		.catch((err) => {
			console.log("Error: " + err);
		});
}

function initPage() {
	document.getElementById("email").value = "";
	document.getElementById("password").value = "";
	document.getElementById("confirm-password").value = "";
	document.getElementById("lastName").value = "";
	document.getElementById("firstName").value = "";
	document.getElementById("input-fields-error").style.display = "none";
	document.getElementById("register-error").style.display = "none";
	document.getElementById("password-error").style.display = "none";

	const form = document.getElementById("register-form");
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		register(event);
	});
}

initPage();
