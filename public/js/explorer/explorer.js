import { initSearchToInput } from './search.js';
import { generateTabs } from './tab.js';
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
                localStorage.setItem(tab.getAttribute('data-path'), 'show');

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

function openPath(path) {
    const explorer = document.querySelector('#explorer-container');
    const parts = path.split('/'); // Split the path into parts for navigation
    let currentElement = explorer;
    let fullPath = ''; // Track the full path as we progress

    for (const part of parts) {
        fullPath = fullPath ? `${fullPath}/${part}` : part; // Combine parts to create the full path

        // Find the tab corresponding to the full path
        const tab = currentElement.querySelector(`.explorer-tab[data-path="${fullPath}"]`);
        if (!tab) {
            console.error(`Path part "${fullPath}" not found.`);
            return;
        }

        // Expand the current dropdown
        const ul = tab.closest('li').querySelector('.explorer-ul');
        if (ul) {
            ul.classList.add(defs.SHOW);

            const arrowSvg = tab.querySelector(`svg`);
            if (arrowSvg) {
                arrowSvg.classList.add(defs.ARROW_FLIPPED);
            }
        }

        // Update the current element to the dropdown for the next iteration
        currentElement = ul;
    }

    // Mark the target path as active
    const targetTab = currentElement?.querySelector(`.explorer-tab[data-path="${fullPath}"]`);
    if (targetTab) {
        targetTab.classList.add(defs.ACTIVE);
    } else {
        console.error(`Target path "${fullPath}" not found.`);
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
                const dropdownState = localStorage.getItem(path);
                if (dropdownState === 'show') {
                    const dropdown = li.querySelector('.explorer-ul');
                    dropdown?.classList.add(defs.SHOW);

                    const arrowSvg = tab.querySelector(`svg`);
                    if (arrowSvg) {
                        arrowSvg.classList.add(defs.ARROW_FLIPPED);
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
    showExplorer,
    expandExplorer,
    collapseExplorer,
    loadExplorerStructure,
    loadExplorer,
    loadExplorerToElement,
    loadExplorerSave,
};