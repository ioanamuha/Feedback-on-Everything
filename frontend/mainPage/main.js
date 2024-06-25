function scroll(direction) {
	const container = document.querySelector(".card-wrapper");
	const scrollAmount = window.innerWidth / 4; // Scrolls a quarter of the window width

	// Use scrollBy for a smooth transition
	container.scrollBy({
		top: 0,
		left: direction * scrollAmount,
		behavior: "smooth",
	});
}
function scrollValidation(direction) {
	const wrapper = document.querySelector(".validation-card-wrapper");
	const cardWidth = wrapper.querySelector(".validation-card").offsetWidth; // Get the width of a card

	wrapper.scrollBy({
		top: 0,
		left: direction * cardWidth, // Scroll by the width of one card
		behavior: "smooth",
	});
}

function Left() {
	var wrapper = document.querySelector(".validation-card-wrapper");
	wrapper.scrollBy({ left: -300, behavior: "smooth" }); // Adjust the value as necessary for your layout
}

function scrollRight() {
	var wrapper = document.querySelector(".validation-card-wrapper");
	wrapper.scrollBy({ left: 300, behavior: "smooth" }); // Adjust the value as necessary for your layout
}

const API_RETRIEVE_AVAILABLE_FORMS =
	"http://127.0.0.1:3000/api/v1/form/available-forms/";

async function initPage() {
	const savedCurrentUser = localStorage.getItem("user");
	if (!savedCurrentUser) {
		window.location.href = "../index.html";
		return;
	}

	const currentUserEmail = JSON.parse(savedCurrentUser).email;
	const authToken = JSON.parse(savedCurrentUser).token;

	const response = await fetch(
		API_RETRIEVE_AVAILABLE_FORMS + currentUserEmail,
		{
			headers: {
				authorization: "Bearer " + authToken,
			},
		}
	);

	if (response.status !== 200) {
		const formsWrapper = document.getElementById("available-forms-wrapper");
		formsWrapper.innerHTML = "No available forms find";
		return;
	}

	const formsWrapper = document.getElementById("available-forms-wrapper");
	const responseData = await response.json();
	responseData.forms.forEach((form) => {
		const formCard = document.createElement("div");
		formCard.className = "form-card";

		const img = document.createElement("img");
		img.src = form.image || "../images/give-your-feedback.png";
		img.alt = "Form Thumbnail";
		img.className = "form-thumbnail";
		formCard.appendChild(img);

		const formDetails = document.createElement("div");
		formDetails.className = "form-details";
		formCard.appendChild(formDetails);

		const h3 = document.createElement("h3");
		h3.textContent = form.title;
		formDetails.appendChild(h3);

		console.log(form.anonymous);
		const userInfo = document.createElement("p");
		userInfo.className = "user-info";
		userInfo.textContent = form.anonymous
			? "Anonymous User"
			: `${form.firstName} ${form.lastName}`;
		formDetails.appendChild(userInfo);

		const formDescription = document.createElement("p");
		formDescription.className = "form-description";
		formDescription.textContent = form.description;
		formDetails.appendChild(formDescription);

		const feedbackButton = document.createElement("button");
		feedbackButton.className = "feedback-button";
		formDetails.appendChild(feedbackButton);

		const a = document.createElement("a");
		a.href = "../giveFeedback/giveFeedback.html";
		a.textContent = "POST FEEDBACK...";
		feedbackButton.appendChild(a);

		formsWrapper.appendChild(formCard);
	});
}

initPage();
