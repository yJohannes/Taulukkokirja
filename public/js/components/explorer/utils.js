import { Tab } from '../../../components/tab/tab.js';

export function openPath(path) {
    const parts = path.split('/'); // Split the path into parts for navigation
    let joinPath = '';

    for (const part of parts) {
        joinPath = joinPath ? joinPath + '/' + part : part;

        // Skip the pages part since it doesn't exist as a tab
        if (joinPath === 'pages') continue;

        const tab = getTabByPath(joinPath);
        const dropdown = Tab.getTabDropdown(tab);

        const isLinkTab = !dropdown;
        const isClosedDropdown = dropdown && !dropdown.classList.contains('show');
        
        if (isLinkTab || isClosedDropdown)
            tab.click();
    }
}

export function getTabByPath(path) {
    const selector = `.tab[data-path="${path}"]`;
    const explorer = document.querySelector('#explorer-nav-container');
    return explorer.querySelector(selector);
}