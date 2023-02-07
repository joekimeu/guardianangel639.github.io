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