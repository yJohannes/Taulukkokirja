import { Tab } from '../../../components/tab/tab.js';

export function showExplorer(bool) {
    const explorerContainer = document.getElementById('explorer-nav-container');

    if (bool) {
        explorerContainer.style.display = 'inline-block';
    } else {
        explorerContainer.style.display = 'none';
    }
}

export function openPath(path) {
    const explorer = document.querySelector('#explorer-nav-container');
    const parts = path.split('/'); // Split the path into parts for navigation
    let joinPath = '';

    for (const part of parts) {
        joinPath = joinPath ? joinPath + '/' + part : part;

        // Don't try to get the pages tab which doesn't exist
        if (joinPath === 'pages') continue;

        const tabClass = `.tab[data-path="${joinPath}"]`;

        const tab = explorer.querySelector(tabClass);
        const dropdown = Tab.getTabDropdown(tab);

        if (!dropdown) {
            tab.click();
        } else if (dropdown && !dropdown.classList.contains('show')) {
            tab.click();
        }
    }
}

export function getTabByPath(path) {
    const explorer = document.querySelector('#explorer-nav-container');
    const tabClass = `.tab[data-path="${path}"]`;
    return explorer.querySelector(tabClass);
}