// dictionary defs 
const dict3D = {
    1: 'sphere',
    2: 'cube',
    3: 'pyramid',
    4: 'cylinder',
    5: 'prism',
    6: 'cone'
}
const dict2D = {
    1: 'circle',
    2: 'square',
    3: 'triangle'
}

// tracks all the pressed buttons
var pressed3D = {
    'left': null,
    'middle': null,
    'right': null,
};
var pressed2D = {
    'left': null,
    'middle': null,
    'right': null,
};

// redirects to the different pages 
function redirect(subdomain) {
    window.location.href = '../' + subdomain + '/index.html';
}

// Adds event listeners too all the buttons 
document.addEventListener('DOMContentLoaded', () => {
    // Get all the fieldsets
    const fieldsets = document.querySelectorAll('.button-group');

    // Go through the fieldsets 
    fieldsets.forEach(fieldset => {
        // Get all the buttons
        const buttons = fieldset.querySelectorAll('.buttonSolver');

        // go though each button in the fieldset 
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Check if the button is already dimmed
                if (button.classList.contains('dimmed')) {
                    // If yes, remove the dimmed class to undim it
                    button.classList.remove('dimmed');
                    // save value
                    saveInfo(button, false);

                } else {
                    // Otherwise, remove the dimmed class from all buttons in this group
                    buttons.forEach(btn => btn.classList.remove('dimmed'));
                    // And add the dimmed class to the clicked button
                    button.classList.add('dimmed');
                    // save value
                    saveInfo(button, true);
                }
                // Call the function to check which button was pressed
                
            });
        });
    });
});

// save the current info 
function saveInfo(button, save) {
    // get cur info
    const fieldset = button.closest('.button-group'); 
    const groupId = fieldset.getAttribute('data-id'); 
    const buttonId = button.getAttribute('data-id'); 
    console.log(`Button ${buttonId} in group ${groupId} was pressed`);
    // cur group
    var group = groupId.substring(0, groupId.length - 2);

    // save the value 
    if(!save){
        pressed3D[group] = null;
    }
    else{
        pressed3D[group] = buttonId;
    }
}