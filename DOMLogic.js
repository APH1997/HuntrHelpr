/*
This file holds the logic to select the first card in "Standard Applications"
and move it to "No Response"
*/

// Select the main tag
const main = Document.querySelector('main')

//Grab div at depth 3
let element = main;
let i = 0
while (i < 3){
    element = element.querySelector('div')
    i++
}


function isStandardApplicationColumn(columnElement){
    const columnTitle = columnElement
        .querySelector('div:first-child span div form input')
        .value

    return columnTitle === "Standard Applications"
}

//Cycle through child divs of element until isStandardApplicationColumn returns true
let StandardApplicationsElement = undefined;

for (let child of element.childNodes){
    if (isStandardApplicationColumn(child)){
        StandardApplicationsElement = child;
        break;
    };
};

if (!StandardApplicationsElement){
    throw new Error('Could not find a column for Standard Applications')
}

//
