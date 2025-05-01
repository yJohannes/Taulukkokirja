import { initSearchToInput } from './search.js';
import { generateTabs, getTabDropdown } from './tab.js';
import { initExplorerButtons } from './buttons.js';

import * as defs from './defs.js'


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
                const state = { show: true, active: false };
                localStorage.setItem(tab.getAttribute('data-path'), JSON.stringify(state));

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
                localStorage.removeItem(tab.getAttribute('data-path'))
                tab.classList.remove(defs.ACTIVE);
                
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

        const tabClass = `.explorer-tab[data-path="${joinPath}"]`;

        const tab = explorer.querySelector(tabClass);
        const dropdown = getTabDropdown(tab);

        if (!dropdown.classList.contains('show')) {
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
                const storedState = localStorage.getItem(path);
                
                if (storedState) {
                    const state = JSON.parse(storedState);
                    
                    if (state.show) {
                        const dropdown = li.querySelector('.explorer-ul');
                        dropdown?.classList.add(defs.SHOW);
                        
                        const arrowSvg = tab.querySelector(`svg`);
                        if (arrowSvg) {
                            arrowSvg.classList.add(defs.ARROW_FLIPPED);
                        }
                    }

                    if (state.active) {
                        tab.classList.add('active');
                    }
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