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
        'left': {
            'name': null,
            'id': null
        },
        'middle': {
            'name': null,
            'id': null
        },
        'right': {
            'name': null,
            'id': null
        }
    },
    '3D': {
        'left': {
            'name': null,
            'id': null,
            'subset': null
        },
        'middle': {
            'name': null,
            'id': null,
            'subset': null
        },
        'right': {
            'name': null,
            'id': null,
            'subset': null
        }
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
    if(dim == '2D'){
        if(save){
            pressed[dim][group] = {
                'name': dictShape['2D'][buttonId],
                'id': buttonId
            };
        }
        else{
            pressed[dim][group] = {
                'name': null,
                'id': null
            };
        }
    }
    else{
        if(save){
            pressed[dim][group] = {
                'name': dictShape['3D'][buttonId],
                'id': buttonId,
                'subset': dictRef3D[dictShape['3D'][buttonId]]
            };
        }
        else{
            pressed[dim][group] = {
                'name': null,
                'id': null,
                'subset': null
            };
        }
    }
}

// solve based off the given info
function solve(){
    // check for valid input 
    var valid2D = validate2D(pressed['2D']);
    var valid3D = validate3D(pressed['3D']);
    if(!valid2D || !valid3D){
        var msg = '<p>Waiting for valid input...</p>';
        document.querySelector('div.itemNesting[data-id="finalShape"]').innerHTML = msg;
        return;
    }
    var msg = '';
    document.querySelector('div.itemNesting[data-id="finalShape"]').innerHTML = msg;

    // // seach for the best path
    // path = findPath(pressed);
    // console.log(path)
}

// validates the 2D inputs 
function validate2D(_2D){
    // reset error message
    document.querySelector('p[data-id="error2D"]').innerHTML = '';

    // count set
    var set = [0,0,0]
    for(var side in _2D){
        curShape = _2D[side]['id'];
        set[curShape-1]+=1;
    }

    // check for double count 
    if(set[0] > 1 || set[1] > 1 || set[2] > 1){
        let msg = '<strong>Error:</strong> You can\'t have more than one of the same shape!';
        document.querySelector('p[data-id="error2D"]').innerHTML = msg;
        return false;
    }

    // check for null
    if(set[0] == 0 || set[1] == 0 || set[2] == 0){
        return false;
    }
    return true;
} 

//validate the 3D inputs
function validate3D(_3D){
    // reset error message
    document.querySelector('p[data-id="error3D"]').innerHTML = '';

    // check that the shape values add up
    var set = [0,0,0,0,0,0]
    var subSet = [0, 0, 0]
    for(var side in _3D){
        curShape = _3D[side]['id']
        subShape = _3D[side]['subset']
        // save sub shape values 
        for(var shape in subShape){
            subSet[subShape[shape] - 1] += 1;
        }
        set[curShape-1]+=1;
    }

    // check that all values add to 2 
    if(subSet[0] != 2 || subSet[1] != 2 || subSet[2] != 2){
        // check if all shapes clicked
        let msg = '<strong>Error:</strong> Imposible shape combination!';
        if(subSet[0] + subSet[1] + subSet[2] == 6){
            document.querySelector('p[data-id="error3D"]').innerHTML = msg;
        }
        // check the values add up
        else if(subSet[0] > 2 || subSet[1] > 2 || subSet[2] > 2){
            document.querySelector('p[data-id="error3D"]').innerHTML = msg;
        }
        return false;
    }
    return true;
}

// // recursivly finds best path 
// function findPath(curState, depth){
//     // base case 1 (works)
//     if(validSpot(path, 'left') && validSpot(path, 'middle') && validSpot(path, 'right')){
//         path;
//     }
//     // base case 2 (fails)
//     if(depth == 6){
//         return false;
//     }

//     // check if left and middle should swap
//     if(!validSpot(curState, 'left') && !validSpot(curState, 'middle')){

//     }

//     // check if left and right should swap
//     if(!validSpot(curState, 'left') && !validSpot(curState, 'right')){
        
//     }

//     // check if middle and right should swap
//     if(!validSpot(curState, 'middle') && !validSpot(curState, 'right')){
        
//     }
// }

// // check that the 3D and 2D have no matching
// function validSpot(curState, side){
//     // get shapes
//     shape2D = curState['2D'][side];
//     shapes3D = dictRef3D[dictShape['3D'][curState['3D'][side]]]
//     // check if any shape matches
//     if(shape2D == shapes3D[0] || shape2D == shapes3D[1]){
//         return false
//     }
//     return true
// }

// // get what two values can swap
// function getSwapOptions(curState, side1, side2){
//     shapes1 = dictRef3D[dictShape['3D'][curState['3D'][side1]]]
//     shapes2 = dictRef3D[dictShape['3D'][curState['3D'][side1]]]
// }