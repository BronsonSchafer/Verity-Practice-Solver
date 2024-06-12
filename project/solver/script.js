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
        });
    });
});