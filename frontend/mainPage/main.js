function scroll(direction) {
	const container = document.querySelector(".card-wrapper");
	const scrollAmount = window.innerWidth / 4; 

	container.scrollBy({
		top: 0,
		left: direction * scrollAmount,
		behavior: "smooth",
	});
}
function scrollValidation(direction) {
	const wrapper = document.querySelector(".validation-card-wrapper");
	const cardWidth = wrapper.querySelector(".validation-card").offsetWidth; 

	wrapper.scrollBy({
		top: 0,
		left: direction * cardWidth, 
		behavior: "smooth",
	});
}

function Left() {
	var wrapper = document.querySelector(".validation-card-wrapper");
	wrapper.scrollBy({ left: -300, behavior: "smooth" }); 
}

function scrollRight() {
	var wrapper = document.querySelector(".validation-card-wrapper");
	wrapper.scrollBy({ left: 300, behavior: "smooth" }); 
}

const API_RETRIEVE_AVAILABLE_FORMS =
	"http://127.0.0.1:3000/api/v1/forms/all";

function goToCreateForm() {
	window.location.href = "../createForm/createForm.html";
}

async function initPage() {
	const savedCurrentUser = localStorage.getItem("user");
	if (!savedCurrentUser) {
		window.location.href = "../index.html";
		return;
	}

	const authToken = JSON.parse(savedCurrentUser).token;

	const response = await fetch(
		API_RETRIEVE_AVAILABLE_FORMS,
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
		a.href = "../giveFeedback/giveFeedback.html?form-id=" + form.id;
		a.textContent = "POST FEEDBACK...";
		feedbackButton.appendChild(a);

		formsWrapper.appendChild(formCard);
	});
}

initPage();
