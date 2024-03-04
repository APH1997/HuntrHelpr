async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function executeScriptInTab(tabId, code) {
    await chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: code
    });
}


async function Main() {
    // Select the main tag
    const tab = await getCurrentTab()

    if (tab) {
        executeScriptInTab(tab.id, () => {
            const main = document.querySelector('main')

            //Grab div at depth 3
            let element = main;
            let i = 0
            while (i < 3) {
                element = element.querySelector('div')
                i++
            }


            function isTargetColumn(columnElement, targetColumnName) {
                const columnTitle = columnElement
                    .querySelector('div:first-child span div form input')
                    .value
                return columnTitle === targetColumnName
            }

            //Cycle through child divs of element until isTargetColumn returns true
            let standardApplicationsElement = undefined;
            let noResponseElement = undefined;

            for (let child of element.childNodes) {
                if (standardApplicationsElement && noResponseElement) {
                    break;
                };
                if (isTargetColumn(child, "Standard Applications")) {
                    standardApplicationsElement = child;
                } else if (isTargetColumn(child, "No Response ")) {
                    noResponseElement = child
                }
            };

            if (!standardApplicationsElement) {
                throw new Error('Could not find a column for Standard Applications')
            } else if (!noResponseElement) {
                throw new Error('Could not find a column for No Response')
            }

            //We have to drill down to the first card in the column for the dragStart
            //drop might work best by fixing the pixel distance to "No Response"

            function getFirstCard(columnElement) {
                //for some reason, the DOM logic selects an ancestor when I put them all in one querySelect
                //so here I just chain it and it works
                //go figure
                const firstCard = columnElement
                    .querySelector('div:last-child')
                    .querySelector('div:first-child')
                    .querySelector('div')
                    .querySelector('div')
                    .childNodes[0]
                return firstCard
            }

            let firstStandardApp = getFirstCard(standardApplicationsElement);
            const dropZone = getFirstCard(noResponseElement)

            firstStandardApp.style.border = '3px solid yellow'
            dropZone.style.border = '3px solid green'

            //Drag/drop logic
            const dragStartEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
            firstStandardApp.dispatchEvent(dragStartEvent)

            const dragMoveEvent = new MouseEvent('mousemove', { bubbles: true, cancelable: true });
            document.dispatchEvent(dragMoveEvent);

            const dropEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
            dropZone.dispatchEvent(dropEvent)
        })
    }
}

const extBtn = document.querySelector('#runScript')
extBtn.addEventListener('click', async () => {
    await Main()
})
