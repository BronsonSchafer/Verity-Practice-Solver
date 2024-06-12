var pressed = [null, null, null];

function redirect(subdomain) {
    window.location.href = '../' + subdomain + '/index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.button-group button');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove the dimmed class from all buttons
            buttons.forEach(btn => btn.classList.remove('dimmed'));
            // Add the dimmed class to the clicked button
            button.classList.add('dimmed');
            pressed[0] = button.getAttribute('data-id')
            solve(button);
        });
    });
});

function solve(button) {
    const buttonId = button.getAttribute('data-id');
    console.log(`Button ${buttonId} was pressed`);
    console.log(pressed)
    // You can add more logic here to handle the pressed button
}