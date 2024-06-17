function toggleAnonym() {
	const anonymChechbox = document.getElementById("anonym").checked;
	console.log(anonymChechbox);
	const firstName = document.getElementById("first-name");
	const lastName = document.getElementById("last-name");

	if (anonymChechbox == true) {
		firstName.disabled = true;
		lastName.disabled = true;
	} else {
		firstName.disabled = false;
		lastName.disabled = false;
	}
}