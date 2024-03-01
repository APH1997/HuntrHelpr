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


function isTargetColumn(columnElement, targetColumnName){
    const columnTitle = columnElement
        .querySelector('div:first-child span div form input')
        .value

    return columnTitle === targetColumnName
}

//Cycle through child divs of element until isTargetColumn returns true
let standardApplicationsElement = undefined;
let noResponseElement = undefined;

for (let child of element.childNodes){
    if (standardApplicationsElement && noResponseElement){
        break;
    };
    if (isTargetColumn(child, "Standard Applications")){
        standardApplicationsElement = child;
    } else if (isTargetColumn(child, "No Response")){
        noResponseElement = child
    }
};

if (!standardApplicationsElement){
    throw new Error('Could not find a column for Standard Applications')
} else if (!noResponseElement){
    throw new Error('Could not find a column for No Response')
}

//We have to drill down to the first card in the column for the dragStart
//drop might work best by fixing the pixel distance to "No Response"

function getFirstCard(columnElement){
    const firstCard = columnElement
        .querySelector('div:last-child div:first-child div:first-child div:first-child div:first-child')
    return firstCard
}
