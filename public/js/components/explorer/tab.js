import { loadPageToElement } from '../pages.js';
import { showSidebar }  from '../../layout/sidebar.js';
import { createArrow } from '../arrow.js';
import { addRippleToElement } from '../../effects/ripple.js';
import { formatPathToHash } from '../pages.js';

import * as defs from './defs.js'
import * as storage from '../storage/index.js';

export function isDropdownTab(tab) {
    return (tab.parentElement.querySelector('ul') !== null);
}

function getTabDropdown(tab) {
    return tab.parentElement.querySelector('ul');
}

function setTabActivity(tab, boolActive) {
    if (boolActive) {
        activeTabs.forEach(t => {
            t.classList.remove(defs.ACTIVE);

            // Not a dropdown tab
            if (getTabDropdown(tab) == null) {
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

function createTab(textOrHTML, level, isDropdown, parentElement)
{
    let tab;
    if (isDropdown) {
        tab = document.createElement('button');
    } else {
        tab = document.createElement('a');
    }

    tab.classList.add('btn', 'btn-light', 'explorer-tab', 'ripple');
    tab.style.setProperty('--level', level);

    if (level === 0) tab.style.fontWeight = 'bold';

    const span = document.createElement('span');
    span.innerHTML = textOrHTML;
    tab.appendChild(span);

    tab.addEventListener('click', () => handleTabClick(tab, isDropdown, parentElement))
    
    // Add arrow to dropdowns
    if (isDropdown) {
        // tab.style.display = 'flex';
        // tab.style.justifyContent = 'space-between';
        // tab.style.alignItems = 'center';
        
        const arrow = createArrow();
        tab.appendChild(arrow);
        tab.addEventListener('click', () => {
            arrow.classList.toggle(defs.ARROW_FLIPPED);
        });
    }

    return tab;
}

// Recursive function to generate the tab list with collapsibility
function generateTabs(data, parentElement, rootPath='') {
    const ul = document.createElement('ul');
    ul.classList.add('explorer-ul');

    for (let key in data) {
        const pageName = key.replace('.html', '');
        const currentPath = rootPath ? rootPath + '/' + key : key;
        const level = currentPath.split('/').length - 1;
        const li = document.createElement('li');

        let tab; 
        if (typeof data[key] === 'object' && data[key] !== null) {
            tab = createTab(pageName, level, true, parentElement);    // Dropdown tab

        } else {
            tab = createTab(pageName, level, false, parentElement);   // Normal tab
            tab.addEventListener('click', () => {
            
                const formatPath = (path) => {
                    path = decodeURIComponent(path);
                    path = path
                        .replaceAll(' ', '_')
                        .replaceAll('.html', '');
                }

                const pagePath = 'pages/' + currentPath;
                const hrefPath = window.location.href.split('/#/')[1] + '.html';

                if (hrefPath !== pagePath.replaceAll(' ', '_'))
                {
                    loadPageToElement(pagePath, 'page-container');
                }
            });
        }
        
        tab.setAttribute('data-path', currentPath)
        tab.setAttribute('href', formatPathToHash('pages/' + currentPath));
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
    getTabDropdown,
};