import { formatting } from '../../js/pages/formatting.js';
import { createArrow } from '../../js/components/common/arrow.js';
import * as storage from '../../js/components/storage/index.js';

export const Tab = {
    createTab,
    createTabList,
    createTabListItem,
    setTabState,
    expandTabListTree,
    collapseTabListTree,
    isDropdownTab,
    getTabDropdown,
    getTabParentDropdown,
    setDropdownState,
};

function createTab(innerHTML, href, isDropdown=false, nestLevel=0, tagName='') {
    let t;
    if (tagName) {
        t = document.createElement(tagName);
    } else if (isDropdown) {
        t = document.createElement('button');
    } else {
        t = document.createElement('a');
    }
    
    t.setAttribute('data-path', href);
    t.setAttribute('href', formatting.formatPathToHash(href));

    t.classList.add('btn', 'tab', 'ripple');
    t.style.setProperty('--level', nestLevel);

    const span = document.createElement('span');
    span.classList.add('tab-content');
    span.innerHTML = innerHTML;
    t.appendChild(span);
    
    // Add arrow to dropdowns
    if (isDropdown) {
        
        const arrow = createArrow();
        t.appendChild(arrow);
        t.addEventListener('click', () => {
            arrow.classList.toggle('flipped');
        });
    }

    return t;
}

function createTabList(isDropdown) {
    const l = document.createElement('ul');
    l.classList.add('tab-list');

    if (isDropdown) 
        l.classList.add('tab-dropdown');

    return l;
}

function createTabListItem() {
    const i = document.createElement('li');
    return i;
}

function setDropdownState(t, isOpen) {
    const arrowSvg = t.querySelector(`svg`);
    const path = t.getAttribute('data-path');
    
    if (isOpen) {
        arrowSvg?.classList.add('flipped');
        storage.addToStorageList('show-states', path);
    } else {
        arrowSvg?.classList.remove('flipped');
        storage.removeFromStorageList('show-states', path);
    }
}
function expandTabListTree(tabList) {
    const uls = tabList.querySelectorAll('.tab-list');
    
    uls.forEach(ul => {
        ul.classList.add('show');
        
        const lis = ul.querySelectorAll('li');
        lis.forEach((li) => {
            const tabs = li.querySelectorAll('.tab');
            tabs.forEach((tab) => {
                Tab.setDropdownState(tab, true);
            });
        });
    });
}


function collapseTabListTree(tabList) {
    const uls = tabList.querySelectorAll('.tab-list');
    
    uls.forEach(ul => {
        ul.classList.remove('show');
        
        const lis = ul.querySelectorAll('li');
        lis.forEach((li) => {
            const tabs = li.querySelectorAll('.tab');
            tabs.forEach((tab) => {
                tab.classList.remove('active');
                Tab.setDropdownState(tab, false);
            });
        });
    });
}

export function setTabState(t, isActive, clearOthersFromParent=false, parentElement=null) {
    if (clearOthersFromParent && parentElement) {
        const activeTabs = parentElement.querySelectorAll(`.${'active'}`);
        
        if (isActive) {
            activeTabs.forEach(t => {
                t.classList.remove('active');
    
                // if (getTabDropdown(tab) == null) // Not a dropdown tab
                    // storage.removeFromStorageList('show-states', t.getAttribute('data-path'));
            });
        }

        return;
    }

    if (isActive) t.classList.add('active');
    else t.classList.remove('active');
}

export function isDropdownTab(t) { return (t.parentElement.querySelector('ul') !== null); }
export function getTabDropdown(t) { return t.parentElement.querySelector('ul') || null; }
export function getTabParentDropdown(t) { return t.parentElement.parentElement || null; }

function handleTabClick(tab, isDropdown, parentElement) {
    const activeTabs = parentElement.querySelectorAll(`.${'active'}`);

    // Handle basic tabs
    if (!isDropdown) {
        // Clicked the current tab
        if (tab.classList.contains('active')) {
            return;
        }
        
        activeTabs.forEach(t => {
            t.classList.remove('active');
            if (!isDropdown) {
                storage.removeFromStorageList('active-states', t.getAttribute('data-path'));
            }
        });

        storage.addToStorageList('active-states', tab.getAttribute('data-path'));
        tab.classList.add('active');

        // If tab is clicked on small screen hide sidebar
        showSidebar(false);
        return;
    }

    // Handle collapsible tabs
    const nestedDropdown = getTabDropdown(tab);
    activeTabs.forEach(t => t.classList.remove('active'));

    // If closing a dropdown, shift focus up a level
    if (nestedDropdown.classList.contains('show')) {
        nestedDropdown.classList.remove('show');
        storage.removeFromStorageList('show-states', tab.getAttribute('data-path'));

        const parentDropdown = tab.parentElement.parentElement;
        const parentTab = parentDropdown.parentElement.querySelector('button');

        // Dismiss highest level dropdown
        if (!(parentDropdown.parentElement.id === 'explorer-nav-container')) {
            parentTab.classList.add('active');
            
            storage.addToStorageList('show-states', parentTab.getAttribute('data-path'));
        }

    } else {
        const autoCollapse = document.getElementById('explorer-auto-collapse')
        const autoCollapseOn = autoCollapse.classList.contains('active');
        
        if (autoCollapseOn) {
            const parentDropdown = tab.parentElement.parentElement;
            const openDropdown = parentDropdown.querySelectorAll(`.${'show'}`);

            openDropdown.forEach(dropdown => {
                const tab = dropdown.parentElement.querySelector('button');
                const arrow = tab.querySelector('svg');
                
                arrow.classList.remove('flipped');
                dropdown.classList.remove('show');
                storage.removeFromStorageList('show-states', tab.getAttribute('data-path'))
            });
        }

        // Set tab as 'active' and show contents
        tab.classList.add('active');
        nestedDropdown.classList.add('show');

        storage.addToStorageList('show-states', tab.getAttribute('data-path'));
    }
}