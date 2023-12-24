const navToggle = document.querySelector('.hamburger-toggle');
const navLinks = document.querySelectorAll('.hamburger__link');

navToggle.addEventListener('click', () => {
    document.body.classList.toggle('hamburger-open'); //was nav-open 
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        document.body.classList.remove('hamburger-open'); //was nav-open 
    })
})

let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 5000); // Change image every 5 seconds
}
