// dictionary defs 
const dictShape = {
    '2D': {
        1: 'circle',
        2: 'square',
        3: 'triangle'
    },
    '2D_names': {
        'circle': 1,
        'square': 2,
        'triangle': 3
    },
    '3D': {
        1: 'sphere',
        2: 'cube',
        3: 'pyramid',
        4: 'cylinder',
        5: 'prism',
        6: 'cone'
    },
    '3D_names':{
        'sphere': 1,
        'cube': 2,
        'pyramid': 3,
        'cylinder': 4,
        'prism': 5,
        'cone' :6
    },
};

const dictRef3D = {
    'sphere': [1, 1],
    'cube': [2, 2],
    'pyramid': [3, 3],
    'cylinder': [1, 2],
    'prism': [2, 3],
    'cone': [1, 3],
    '11': 'sphere',
    '22': 'cube',
    '33': 'pyramid',
    '12': 'cylinder',
    '23': 'prism',
    '13': 'cone',
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

    // seach for the best path
    path = findPath(pressed, 0);
    console.log(path)

    displayPath(path);
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

// recursivly finds best path 
function findPath(curState, depth){
    // base case 1 (works)
    if(validSpot(curState, 'left') && validSpot(curState, 'middle') && validSpot(curState, 'right')){
        curState;
    }
    // base case 2 (fails)
    if(depth == 6){
        return false;
    }

    // check if left and middle should swap
    debugger
    if(!validSpot(curState, 'left') || !validSpot(curState, 'middle')){
        let options = getSwapOptions(curState, 'left', 'middle');
        let best = makeSwap(curState, options[0]);
        console.log(curState)
        console.log(best)
        console.log(best)
        debugger
    }

    // check if left and right should swap
    if(!validSpot(curState, 'left') && !validSpot(curState, 'right')){
        let options = getSwapOptions(curState, 'left', 'right');
    }

    // check if middle and right should swap
    if(!validSpot(curState, 'middle') && !validSpot(curState, 'right')){
        let options = getSwapOptions(curState, 'middle', 'right');
    }
}

// check that the 3D and 2D have no matching
function validSpot(curState, side){
    // get shapes
    shape2D = curState['2D'][side]['id'];
    shapes3D = curState['3D'][side]['subset'];
    // check if any shape matches
    if(shape2D == shapes3D[0] || shape2D == shapes3D[1]){
        return false;
    }
    return true;
}

// get what two values can swap
function getSwapOptions(curState, side1, side2){
    // values 
    let shapes1_2D = curState['2D'][side1]['id'];
    let shapes2_2D = curState['2D'][side2]['id'];
    let shapes1_3D = curState['3D'][side1]['subset'];
    let shapes2_3D = curState['3D'][side2]['subset'];
    // get all possible options
    let options = [];
    for(let i = 0; i < 2; i++){
        for(let j = 0; j < 2; j++){
            // check that swapping to different shapes 
            if(shapes1_3D[i] != shapes2_3D[j]){
                // check that the shape is a good move
                if(shapes1_3D[i] == shapes1_2D || shapes2_3D[i] == shapes2_2D){
                    options.push([[side1, side2],[shapes1_3D[i], shapes2_3D[j]]]);
                }
            }
        }
    }
    // remove double values 
    let betterOptions = [options[0]];
    for(let i = 0; i < options.length; i++){
        let newOpt = true;
        for(let j = 0; j < betterOptions.length; j++){
            if(JSON.stringify(options[i]) == JSON.stringify(betterOptions[j])){
                newOpt = false;
            }
        }
        if(newOpt){
            betterOptions.push(options[i]);
        }
    }
    return betterOptions;
}

// makes the swap and updates the struct
// swap = [[left, right], [1, 2]]
function makeSwap(curState, swap){
    // get needed values 
    let side1 = swap[0][0];
    let side2 = swap[0][1];
    let val1 = swap[1][0];
    let val2 = swap[1][1];
    // new struct 
    newState = JSON.parse(JSON.stringify(curState));
    newState['3D'][swap[0][0]]
    // make swap
    if(newState['3D'][side1]['subset'][0] == val1){
        newState['3D'][side1]['subset'][0] = val2;
    }
    else{
        newState['3D'][side1]['subset'][1] = val2;
    }
    // swap 2
    if(newState['3D'][side2]['subset'][0] == val2){
        newState['3D'][side2]['subset'][0] = val1;
    }
    else{
        newState['3D'][side2]['subset'][1] = val1;
    }
    // update order (helps with updating shape)
    newState['3D'][side1]['subset'].sort();
    newState['3D'][side2]['subset'].sort();
    // update shape 1
    let newID = newState['3D'][side1]['subset'][0].toString() + newState['3D'][side1]['subset'][1].toString();
    newState['3D'][side1]['name'] = dictRef3D[newID];
    newState['3D'][side1]['id'] = dictShape['3D_names'][dictRef3D[newID]];
    // update shape 2
    newID = newState['3D'][side2]['subset'][0].toString() + newState['3D'][side2]['subset'][1].toString();
    newState['3D'][side2]['name'] = dictRef3D[newID];
    newState['3D'][side2]['id'] = dictShape['3D_names'][dictRef3D[newID]];

    return newState;
}