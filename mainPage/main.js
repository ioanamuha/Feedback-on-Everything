function scroll(direction) {
    const container = document.querySelector('.card-wrapper');
    const scrollAmount = window.innerWidth / 4; // Scrolls a quarter of the window width

    // Use scrollBy for a smooth transition
    container.scrollBy({
        top: 0,
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}
function scrollValidation(direction) {
    const wrapper = document.querySelector('.validation-card-wrapper');
    const cardWidth = wrapper.querySelector('.validation-card').offsetWidth; // Get the width of a card

    wrapper.scrollBy({
        top: 0,
        left: direction * cardWidth, // Scroll by the width of one card
        behavior: 'smooth'
    });
}

function Left() {   
    var wrapper = document.querySelector('.validation-card-wrapper');
    wrapper.scrollBy({ left: -300, behavior: 'smooth' }); // Adjust the value as necessary for your layout
}

function scrollRight() {
    var wrapper = document.querySelector('.validation-card-wrapper');
    wrapper.scrollBy({ left: 300, behavior: 'smooth' }); // Adjust the value as necessary for your layout
}