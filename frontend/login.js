const API_BASE_URL = "http://127.0.0.1:3000/api/v1/login";

function redirectToHomePage() {
	window.location.href = "./mainPage/main.html";
}

async function login(event) {
	const data = new FormData(event.target);
	const email = data.get("email") || "";
	const password = data.get("password") || "";

	const requestData = {
		email: email,
		password: password,
	};
	fetch(API_BASE_URL, {
		mode: "cors",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestData),
	})
		.then(async (res) => {
			if (res.status !== 200) {
				document.getElementById("login-error").style.display = "block";
				return;
			}

			document.getElementById("login-error").style.display = "none";

			const isRememberMe = document.getElementById("remember-me").checked;
			if (isRememberMe) {
				localStorage.setItem("remember-user-login", "true");
			}

			const responseData = await res.json();
			const authToken = responseData.token;
			localStorage.setItem(
				"user",
				JSON.stringify({ token: authToken, email: email })
			);

			document.getElementById("email").value = "";
			document.getElementById("password").value = "";

			redirectToHomePage();
		})
		.catch((err) => {
			console.log("Error: " + err);
		});
}

function initPage() {
	const isRememberMe = localStorage.getItem("remember-user-login");
	if (isRememberMe && isRememberMe == "true") {
		redirectToHomePage();
	}

	document.getElementById("email").value = "";
	document.getElementById("password").value = "";
	document.getElementById("remember-me").checked = false;

	const form = document.getElementById("login-form");
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		login(event);
	});
}

initPage();
