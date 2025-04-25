import { loadPageToElement } from '../pages.js';
import { showSidebar }  from '../sidebar.js';
import { createArrow } from '../arrow.js';

import * as defs from './defs.js'


function handleTabClick(tab, isDropdown, parentElement)
{
    const activeTabs = parentElement.querySelectorAll(`.${defs.ACTIVE}`);

    // Handle basic tabs
    if (!isDropdown) {
        if (tab.classList.contains(defs.ACTIVE)) return;  // Clicked the current tab

        activeTabs.forEach(t => {
            t.classList.remove(defs.ACTIVE);
            localStorage
        });
        tab.classList.add(defs.ACTIVE);

        // If tab is clicked on small screen hide sidebar
        showSidebar(false);
        return;
    }

    // Handle collapsible tabs
    const nestedDropdown = tab.parentElement.querySelector('ul');
    activeTabs.forEach(t => t.classList.remove(defs.ACTIVE));

    // If closing a dropdown, shift focus up a level
    if (nestedDropdown.classList.contains(defs.SHOW)) {
        nestedDropdown.classList.remove(defs.SHOW);
        localStorage.removeItem(tab.getAttribute('data-path'))


        const parentDropdown = tab.parentElement.parentElement;
        const parentTab = parentDropdown.parentElement.querySelector('div');

        // Dismiss highest level dropdown
        if (!(parentDropdown.parentElement.id === 'explorer-container')) {
            parentTab.classList.add(defs.ACTIVE);
            localStorage.setItem(parentTab.getAttribute('data-path'), 'show');
        }

    } else {
        const autoCollapse = document.getElementById('explorer-auto-collapse')
        const autoCollapseOn = autoCollapse.classList.contains(defs.ACTIVE);
        
        if (autoCollapseOn) {
            const parentDropdown = tab.parentElement.parentElement;

            const openDropdown = parentDropdown.querySelectorAll(`.${defs.SHOW}`);
            openDropdown.forEach(m => {
                m.classList.remove(defs.SHOW);
                
                const tab = m.parentElement.querySelector('div');
                const arrow = tab.querySelector('svg');
                arrow.classList.remove(defs.ARROW_FLIPPED);
                localStorage.removeItem(tab.getAttribute('data-path'))
            });
        }

        // Set tab as defs.ACTIVE and show contents
        tab.classList.add(defs.ACTIVE);
        localStorage.setItem(tab.getAttribute('data-path'), 'show');

        nestedDropdown.classList.add(defs.SHOW);
    }
}

function createTab(textOrHTML, level, isDropdown, parentElement)
{
    const tab = document.createElement('div');
    tab.classList.add("btn", "btn-light", "btn-no-focus", "explorer-tab", "ripple");
    tab.style.setProperty('--level', level);

    if (level === 0) tab.style.fontWeight = 'bold';

    const span = document.createElement('span');
    span.innerHTML = textOrHTML;
    tab.appendChild(span);

    tab.addEventListener('click', () => handleTabClick(tab, isDropdown, parentElement))
    
    // Add arrow to dropdowns
    if (isDropdown) {
        tab.classList.add('flip-arrow-container');
        tab.addEventListener('click', () => {

            arrow.classList.toggle(defs.ARROW_FLIPPED);
        });

        const arrow = createArrow();
        tab.appendChild(arrow);
    }

    return tab;
}

// Recursive function to generate the tab list with collapsibility
function generateTabs(data, parentElement, rootPath="") {
    const ul = document.createElement('ul');
    ul.classList.add("explorer-ul");

    for (let key in data) {
        let currentPath = rootPath + key + "/";
        const pageName = key.replace(".html", "");

        const li = document.createElement('li');

        let tab; 
        const level = currentPath.split('/').length - 2;
        if (typeof data[key] === 'object' && data[key] !== null) {
            tab = createTab(pageName, level, true, parentElement);    // Dropdown tab

        } else {
            currentPath = currentPath.slice(0, -1);  // Remove trailing '/'
            tab = createTab(pageName, level, false, parentElement);   // Normal tab
            tab.addEventListener('click', () => {
                loadPageToElement('pages/' + currentPath, 'page-container');
            });

        }
        
        li.appendChild(tab);
        tab.setAttribute('data-path', currentPath)

        // If the value is an object (i.e., nested dropdown), recursively create a nested dropdown
        if (typeof data[key] === 'object' && data[key] !== null) {
            const nestedDropdown = generateTabs(data[key], parentElement, currentPath);
            nestedDropdown.classList.add("explorer-dropdown");  // Add class to style the nested dropdown
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