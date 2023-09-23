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
const username = document.getElementById('username');
const password = document.getElementById('password');
const form = document.getElementById('form');
const errorElement = document.getElementById('error');


form.addEventListener('submit', (e) => {
    let messages = [];
    if (username.value != 'gahaemployee' && password.value != 'thankyouguys') {
        messages.push('Incorrect Username and Password');
        username.style.border ="3px solid red";
        password.style.border ="3px solid red";
        username.focus();
        password.focus()
    }

    else if (password.value != 'thankyouguys') {
        messages.push('Incorrect Password');
        username.style.border = "";
        password.style.border ="3px solid red";
        password.focus();
    } 
  
    else if (username.value != 'gahaemployee') {
        messages.push('Incorrect Username');
        username.style.border ="3px solid red";
        password.style.border = "";
        username.focus();
    } 
    
    if (messages.length > 0) {
        e.preventDefault();
        errorElement.innerText = messages.join(', ');
        messages.style.border = "3px solid red";
        messages.style.display = "block";
    }
})