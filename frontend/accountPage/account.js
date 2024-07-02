const API_USER_CONTROLLER = "http://127.0.0.1:3000/api/v1/users/";

async function update(event) {
	document.getElementById("update-error").style.display = "none";

	const data = new FormData(event.target);
	const phoneNumber = data.get("phone-number") || "";
	const firstName = data.get("first-name") || "";
	const lastName = data.get("last-name") || "";

	const authToken = JSON.parse(localStorage.getItem("user")).token;
	const currentUserEmail = JSON.parse(localStorage.getItem("user")).email;

	const updateData = {
		firstName: firstName,
		lastName: lastName,
		phoneNumber: phoneNumber,
	};

	const response = await fetch(API_USER_CONTROLLER + currentUserEmail, {
		method: "PATCH",
		body: JSON.stringify(updateData),
		headers: {
			"Content-Type": "application/json",
			authorization: "Bearer " + authToken,
		},
	});

	if (response.status !== 200) {
		document.getElementById("update-error").style.display = "block";
		return;
	}

	window.location.reload();
}

async function initPage() {
	document.getElementById("update-error").style.display = "none";

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
		document.getElementById("first-name").value = "Not found :(";
		document.getElementById("last-name").value = "Not found :(";
		document.getElementById("phone-number").value = "Not found :(";
		document.getElementById("email-address").value = "Not found :(";

		document.getElementById("displayed-name").value = "Name not found";
		document.getElementById("displayed-email").value = "Not found :(";
		return;
	}

	const resData = await response.json();
	document.getElementById("first-name").value = resData.user.firstName;
	document.getElementById("last-name").value = resData.user.lastName;
	document.getElementById("phone-number").value =
		resData.user.phoneNumber || "";
	document.getElementById("email-address").value = resData.user.email;

	document.getElementById(
		"displayed-name"
	).innerText = `${resData.user.firstName} ${resData.user.lastName}`;
	document.getElementById("displayed-email").innerText = resData.user.email;

	const logoutButton = document.getElementById("logout-button");
	logoutButton.addEventListener("click", () => {
		localStorage.removeItem("user");
		localStorage.removeItem("remember-user-login");
		window.location.href = "../index.html";
	});

	const form = document.getElementById("update-account-form");
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		update(event);
	});
}

initPage();
