// dictionary defs 
const dictShape = {
    '2D': {
        1: 'circle',
        2: 'square',
        3: 'triangle'
    },
    '3D': {
        1: 'sphere',
        2: 'cube',
        3: 'pyramid',
        4: 'cylinder',
        5: 'prism',
        6: 'cone'
    }
};

const dictRef3D = {
    'sphere': [1, 1],
    'cube': [2, 2],
    'pyramid': [3, 3],
    'cylinder': [1, 2],
    'prism': [2, 3],
    'cone': [1, 3],
}

// tracks all the pressed buttons
var pressed = {
    '2D': {
        'left': null,
        'middle': null,
        'right': null,
    },
    '3D': {
        'left': null,
        'middle': null,
        'right': null,
    }
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
                // Call to try and solve
                solve();
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
    // console.log(`Button ${buttonId} in group ${groupId} was pressed`);

    // cur group (left/mid/right) and dim (2D/3D)
    var group = groupId.substring(0, groupId.length - 2);
    var dim = groupId.substring(groupId.length - 2);

    // save the value 
    if(!save){
        pressed[dim][group] = null;
    }
    else{
        pressed[dim][group] = buttonId;
    }
}

// solve based off the given info
function solve(){
    var valid = validate();
    console.log(valid)
    // check that all values are filled

}

// validates the inputs 
function validate(){
    // check if any values are null
    for(var dim in pressed){
        for(var side in pressed[dim]){
            if(pressed[dim][side] == null){
                return null;
            }
        }
    }

    // check that none of the 2D shapes are the same
    const _2D = pressed['2D'];
    if(_2D['left'] == _2D['middle'] || _2D['left'] == _2D['right'] || _2D['middle'] == _2D['right']){
        return false;
    }

    // check that the shape values add up
    var subSet = [0, 0, 0]
    for(var side in pressed['3D']){
        curShape = pressed['3D'][side]
        subShape = dictRef3D[dictShape['3D'][curShape]]
        // save sub shape values 
        for(var shape in subShape){
            subSet[subShape[shape] - 1] += 1;
        }
    }
    // check that all values add to 2 
    if(subSet[0] != 2 || subSet[1] != 2 || subSet[2] != 2){
        return false
    }

    // all tests pass
    return true;
} 