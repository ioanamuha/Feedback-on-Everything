const API_GET_USER_FORMS = "http://127.0.0.1:3000/api/v1/form/available-forms";
const API_USER_CONTROLLER = "http://127.0.0.1:3000/api/v1/users/";

async function loadUserCreatedForms() {
    const savedCurrentUser = localStorage.getItem("user");
    if (!savedCurrentUser) {
        window.location.href = "../index.html";
        return;
    }

    const logoutButton = document.getElementById("logout-button");
	logoutButton.addEventListener("click", () => {
		localStorage.removeItem("user");
        localStorage.removeItem("remember-user-login");
		window.location.href = "../index.html";
	});

    const currentUserEmail = JSON.parse(savedCurrentUser).email;
    const authToken = JSON.parse(savedCurrentUser).token;

    const response = await fetch(API_USER_CONTROLLER + currentUserEmail, {
		headers: {
			authorization: "Bearer " + authToken,
		},
	});

    if (response.status !== 200) {
		document.getElementById("displayed-name").value = "Name not found";
		document.getElementById("displayed-email").value = "Not found :(";
		return;
	}

    const resData = await response.json();
	document.getElementById(
		"displayed-name"
	).innerText = `${resData.user.firstName} ${resData.user.lastName}`;
	document.getElementById("displayed-email").innerText = resData.user.email;

    try {
        const response = await fetch(`${API_GET_USER_FORMS}/${currentUserEmail}`, {
            headers: {
                authorization: "Bearer " + authToken,
            },
        });

        const data = await response.json();

        if (response.status === 404) {
            document.getElementById("user-forms-wrapper").innerHTML = "No forms found.";
            return;
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Error loading forms");
        }

        displayUserForms(data.forms);
    } catch (error) {
        console.error("Error loading user forms:", error);
        document.getElementById("user-forms-wrapper").innerHTML = "An error occurred while loading forms.";
    }
}

function displayUserForms(forms) {
    const formsWrapper = document.getElementById("user-forms-wrapper");
    formsWrapper.innerHTML = '';

    forms.forEach((form) => {
        const formCard = document.createElement("div");
        formCard.className = "form-card";
        formCard.innerHTML = `
            <img src="${form.image || "../images/give-your-feedback.png"}" alt="Form Thumbnail" class="form-thumbnail">
            <div class="form-details">
                <h3>${form.title}</h3>
                <p class="user-info">${form.anonymous ? "Anonymous User" : `${form.firstName} ${form.lastName}`}</p>
                <p class="form-description">${form.description}</p>
                <a href="../Statistics/statistics.html?form-id=${form.id}" class="feedback-button">SEE STATISTICS</a>
            </div>
        `;
        formsWrapper.appendChild(formCard);
    });
}

document.addEventListener('DOMContentLoaded', loadUserCreatedForms);