import { loadPageToElement } from '../pages.js';
import { showSidebar }  from '../../layout/sidebar.js';
import { createArrow } from '../common/arrow.js';
import { addRippleToElement } from '../../effects/ripple.js';
import { formatPathToHash } from '../pages.js';
import { updateBookmarks } from '../bookmarks/index.js';

import * as defs from './defs.js'
import * as storage from '../storage/index.js';


export function isDropdownTab($tab) {
    return ($tab.parentElement.querySelector('ul') !== null);
}

export function getTabDropdown($tab) {
    return $tab.parentElement.querySelector('ul') || null;
}

export function getTabParentDropdown($tab) {
    return $tab.parentElement.parentElement || null;

}

function setTabActivity($tab, isActive) {
    if (isActive) {
        activeTabs.forEach(t => {
            t.classList.remove(defs.ACTIVE);

            // Not a dropdown tab
            if (getTabDropdown($tab) == null) {
                storage.removeFromStorageList('show-states', t.getAttribute('data-path'));
            }
        });
    }
}

function handleTabClick(tab, isDropdown, parentElement)
{
    const activeTabs = parentElement.querySelectorAll(`.${defs.ACTIVE}`);

    // Handle basic tabs
    if (!isDropdown) {
        // Clicked the current tab
        if (tab.classList.contains(defs.ACTIVE)) {
            return;
        }
        
        activeTabs.forEach(t => {
            t.classList.remove(defs.ACTIVE);
            if (!isDropdown) {
                storage.removeFromStorageList('active-states', t.getAttribute('data-path'));
            }
        });

        storage.addToStorageList('active-states', tab.getAttribute('data-path'));
        tab.classList.add(defs.ACTIVE);

        // If tab is clicked on small screen hide sidebar
        showSidebar(false);
        return;
    }

    // Handle collapsible tabs
    const nestedDropdown = getTabDropdown(tab);
    activeTabs.forEach(t => t.classList.remove(defs.ACTIVE));

    // If closing a dropdown, shift focus up a level
    if (nestedDropdown.classList.contains(defs.SHOW)) {
        nestedDropdown.classList.remove(defs.SHOW);
        storage.removeFromStorageList('show-states', tab.getAttribute('data-path'));

        const parentDropdown = tab.parentElement.parentElement;
        const parentTab = parentDropdown.parentElement.querySelector('button');

        // Dismiss highest level dropdown
        if (!(parentDropdown.parentElement.id === 'explorer-container')) {
            parentTab.classList.add(defs.ACTIVE);
            
            storage.addToStorageList('show-states', parentTab.getAttribute('data-path'));
        }

    } else {
        const autoCollapse = document.getElementById('explorer-auto-collapse')
        const autoCollapseOn = autoCollapse.classList.contains(defs.ACTIVE);
        
        if (autoCollapseOn) {
            const parentDropdown = tab.parentElement.parentElement;
            const openDropdown = parentDropdown.querySelectorAll(`.${defs.SHOW}`);

            openDropdown.forEach(dropdown => {
                const tab = dropdown.parentElement.querySelector('button');
                const arrow = tab.querySelector('svg');
                
                arrow.classList.remove(defs.ARROW_FLIPPED);
                dropdown.classList.remove(defs.SHOW);
                storage.removeFromStorageList('show-states', tab.getAttribute('data-path'))
            });
        }

        // Set tab as defs.ACTIVE and show contents
        tab.classList.add(defs.ACTIVE);
        nestedDropdown.classList.add(defs.SHOW);

        storage.addToStorageList('show-states', tab.getAttribute('data-path'));
    }
}

function createTab(textOrHTML, level, isDropdown, path, tagName='')
{
    let tab;
    if (tagName) {
        tab = document.createElement(tagName);
    } else if (isDropdown) {
        tab = document.createElement('button');
    } else {
        tab = document.createElement('a');
    }
    
    tab.setAttribute('data-path', path)
    tab.setAttribute('href', formatPathToHash(path));

    tab.classList.add('btn', 'btn-light', 'explorer-tab', 'ripple');
    tab.style.setProperty('--level', level);

    const span = document.createElement('span');
    span.innerHTML = textOrHTML;
    tab.appendChild(span);
    
    // Add arrow to dropdowns
    if (isDropdown) {        
        const arrow = createArrow();
        tab.appendChild(arrow);
        tab.addEventListener('click', () => {
            arrow.classList.toggle(defs.ARROW_FLIPPED);
        });
    }

    return tab;
}

// Recursive function to generate the tab list with collapsibility
function generateTabs(data, parentElement, rootPath='pages') {
    const ul = document.createElement('ul');
    ul.classList.add('explorer-ul');

    data = data.pages || data; // Support both top-level and nested calls


    for (let key in data) {
        const pageName = key.replace('.html', '');
        const currentPath = rootPath ? rootPath + '/' + key : key;
        const level = currentPath.split('/').length - 1 - 1; // sub 1 again because of pages as root 
        const li = document.createElement('li');

        let tab; 
        if (typeof data[key] === 'object' && data[key] !== null) {
            tab = createTab(pageName, level, true, currentPath);    // Dropdown tab
            tab.addEventListener('click', () => handleTabClick(tab, true, parentElement));
            if (level === 0) tab.style.fontWeight = 'bold';


        } else {
            tab = createTab(pageName, level, false, currentPath);   // Normal tab
            tab.addEventListener('click', () => handleTabClick(tab, false, parentElement));

            tab.addEventListener('click', () => {
        
                const hrefPath = window.location.href.split('/#/')[1] + '.html';

                if (hrefPath !== currentPath.replaceAll(' ', '_'))
                {
                    loadPageToElement(currentPath, 'page-container');
                }
            });
        }
        
        tab.addEventListener('click', () => updateBookmarks());

        addRippleToElement(tab);
        
        li.appendChild(tab);

        // If the value is an object (i.e., nested dropdown), recursively create a nested dropdown
        if (typeof data[key] === 'object' && data[key] !== null) {
            const nestedDropdown = generateTabs(data[key], parentElement, currentPath);
            nestedDropdown.classList.add('explorer-dropdown');

            li.appendChild(nestedDropdown);
        }

        ul.appendChild(li);
    }

    return ul;
}

export {
    createTab,
    generateTabs,
};