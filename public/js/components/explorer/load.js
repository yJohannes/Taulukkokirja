import { initSearchToInput } from './search.js';
import { generateTabs, getTabDropdown, isDropdownTab } from './tab.js';
import { initExplorerButtons } from './buttons.js';

import * as defs from './defs.js';
import * as storage from '../storage/index.js';


function loadExplorerSave()
{
    const $explorer = document.querySelector('#explorer-container');
    const $uls = $explorer.querySelectorAll('.explorer-ul');
    
    // Collapse all dropdowns and unflip arrows
    $uls.forEach($ul => {
        const $lis = $ul.querySelectorAll('li');
        $lis.forEach(($li) => {
            const $tabs = $li.querySelectorAll('.explorer-tab');
            $tabs.forEach(($tab) => {
                const path = $tab.getAttribute('data-path');
                if (isDropdownTab($tab)) {
                    if (storage.getFromStorageList('show-states').includes(path)) {
                        const $dropdown = $li.querySelector('.explorer-ul');
                        $dropdown?.classList.add(defs.SHOW);
                        
                        const $arrowSvg = $tab.querySelector(`svg`);
                        if ($arrowSvg) {
                            $arrowSvg.classList.add(defs.ARROW_FLIPPED);
                        }
                    }

                } else if (storage.getFromStorageList('active-states').includes(path)) {
                    $tab.classList.add('active');
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

async function loadExplorer($parentElement)
{
    try {
        const structure = await loadExplorerStructure();
        const $tabs = generateTabs(structure, $parentElement);
        return $tabs;

    } catch (error) {
        console.error('Failed to fetch the page structure: ', error);
    }

    return null;
};

async function loadExplorerToElement($element)
{    
    const $search = document.getElementById('explorer-search');
    initSearchToInput($search)
    const $ul = await loadExplorer($element);
    $element.appendChild($ul);

    initExplorerButtons();
}



export {
    loadExplorerStructure,
    loadExplorer,
    loadExplorerToElement,
    loadExplorerSave,
};