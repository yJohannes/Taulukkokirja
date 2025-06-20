import { Tab } from '../../../components/tab/tab.js';

function openPath(rootElement, path) {
    const parts = path.split('/'); // Split the path into parts for navigation
    let joinPath = '';

    for (const part of parts) {
        joinPath = joinPath ? joinPath + '/' + part : part;

        // Skip the pages part since it doesn't exist as a tab
        if (joinPath === 'pages') continue;

        const tab = getTabByPath(rootElement, joinPath);
        const dropdown = Tab.getTabDropdown(tab);

        const isLinkTab = !dropdown;
        const isClosedDropdown = dropdown && !dropdown.classList.contains('show');
        
        if (isLinkTab || isClosedDropdown)
            tab.click();
    }
}

function getTabByPath(rootElement, path) {
    const selector = `.tab[data-path="${path}"]`;
    return rootElement.querySelector(selector);
}

export const FileExplorerUtils = {
    openPath,
    getTabByPath,
}