// hamburger toggle effects
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

//login password information
const username = document.getElementById('username')
const password = document.getElementById('password')
const form = document.getElementById('form')
const errorElement = document.getElementById('error')

form.addEventListener('submit', (e) => {
    let messages = []
    if (username.value === '' || username.value == null) {
        messages.push('Username is required')
    }

    if (password.value === '' || password.value == null) {
        messages.push('Username is required')
    }

    if (messages.length > 0) {
        e.preventDefault()
        errorElement.innerText = messages.join(', ')
    }
})