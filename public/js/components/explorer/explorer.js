import { initSearchToInput } from './search.js';
import { generateTabs, getTabDropdown, isDropdownTab } from './tab.js';
import { initExplorerButtons } from './buttons.js';

import * as defs from './defs.js';
import * as storage from '../storage/index.js';


function showExplorer(bool)
{
    const explorerContainer = document.getElementById('explorer-container');

    if (bool) {
        explorerContainer.style.display = 'inline-block';
    } else {
        explorerContainer.style.display = 'none';

    }
}

function expandExplorer()
{
    const explorer = document.querySelector('#explorer-container');
    const uls = explorer.querySelectorAll('.explorer-ul');
    
    // Expand all dropdowns and flip arrows
    uls.forEach(ul => {
        ul.classList.add(defs.SHOW);
        
        const lis = ul.querySelectorAll('li');
        lis.forEach((li) => {
            const tabs = li.querySelectorAll('.explorer-tab');
            tabs.forEach((tab) => {
                storage.addToStorageList('show-states', tab.getAttribute('data-path'));

                const arrowSvg = tab.querySelector(`svg`);
                if (arrowSvg) {
                    arrowSvg.classList.add(defs.ARROW_FLIPPED);
                }
            });
        });
    });
}

function collapseExplorer()
{
    const explorer = document.querySelector('#explorer-container');
    const uls = explorer.querySelectorAll('.explorer-ul');
    
    // Collapse all dropdowns and unflip arrows
    uls.forEach(ul => {
        ul.classList.remove(defs.SHOW);
        
        
        const lis = ul.querySelectorAll('li');
        lis.forEach((li) => {
            const tabs = li.querySelectorAll('.explorer-tab');
            tabs.forEach((tab) => {
                tab.classList.remove(defs.ACTIVE);
                storage.removeFromStorageList('show-states', tab.getAttribute('data-path'));
                
                const arrowSvg = tab.querySelector(`svg`);
                if (arrowSvg) {
                    arrowSvg.classList.remove(defs.ARROW_FLIPPED);
                }
            });
        });
    });
}

function getTabByPath(path) {
    const explorer = document.querySelector('#explorer-container');
    const tabClass = `.explorer-tab[data-path="${path}"]`;
    return explorer.querySelector(tabClass);
}

function openPath(path) {
    const explorer = document.querySelector('#explorer-container');
    const parts = path.split('/'); // Split the path into parts for navigation
    let joinPath = '';

    for (const part of parts) {
        joinPath = joinPath ? joinPath + '/' + part : part;

        // Don't try to get the pages tab which doesn't exist
        if (joinPath === 'pages') continue;

        const tabClass = `.explorer-tab[data-path="${joinPath}"]`;

        const tab = explorer.querySelector(tabClass);
        const dropdown = getTabDropdown(tab);

        if (!dropdown) {
            tab.click();
        } else if (dropdown && !dropdown.classList.contains('show')) {
            tab.click();
        }
    }
}

function loadExplorerSave()
{
    const explorer = document.querySelector('#explorer-container');
    const uls = explorer.querySelectorAll('.explorer-ul');
    
    // Collapse all dropdowns and unflip arrows
    uls.forEach(ul => {
        const lis = ul.querySelectorAll('li');
        lis.forEach((li) => {
            const tabs = li.querySelectorAll('.explorer-tab');
            tabs.forEach((tab) => {
                const path = tab.getAttribute('data-path');
                if (isDropdownTab(tab)) {
                    if (storage.getFromStorageList('show-states').includes(path)) {
                        const dropdown = li.querySelector('.explorer-ul');
                        dropdown?.classList.add(defs.SHOW);
                        
                        const arrowSvg = tab.querySelector(`svg`);
                        if (arrowSvg) {
                            arrowSvg.classList.add(defs.ARROW_FLIPPED);
                        }
                    }

                } else if (storage.getFromStorageList('active-states').includes(path)) {
                    tab.classList.add('active');
                }                    
            });
        });
    });
}

async function loadExplorerStructure()
{
    const response = await fetch('/api/pages-structure');

    if (!response.ok) {
        console.error("Failed to fetch the page structure");
        return;
    }

    const structure = await response.json();
    return structure;
}

async function loadExplorer(parentElement)
{
    try {
        const structure = await loadExplorerStructure();
        console.log(structure)
        const tabs = generateTabs(structure, parentElement);
        return tabs;

    } catch (error) {
        console.error('Failed to fetch the page structure: ', error);
    }

    return null;
};

async function loadExplorerToElement(element)
{    
    const search = document.getElementById('explorer-search');
    initSearchToInput(search)
    const ul = await loadExplorer(element);
    element.appendChild(ul);

    initExplorerButtons();
}



export {
    openPath,
    getTabByPath,
    showExplorer,
    expandExplorer,
    collapseExplorer,
    loadExplorerStructure,
    loadExplorer,
    loadExplorerToElement,
    loadExplorerSave,
};