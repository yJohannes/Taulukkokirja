import { formatting } from '../../js/pages/formatting.js';
import { FlipArrow } from '../flip_arrow/flip-arrow.js';
import { StorageHelper } from '../../js/components/storage/index.js';

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

/**
 * 
 * @param {string} innerHTML 
 * @param {string} href 
 * @param {boolean} isDropdown 
 * @param {number} nestLevel 
 * @param {string} tagName 
 * @param {string} rippleColor light | dark
 * @returns {HTMLElement}
 */
function createTab({
  innerHTML,
  href,
  isDropdown = false,
  nestLevel = 0,
  tagName = '',
  rippleColor = 'dark',
} = {}) {
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

    t.classList.add('btn', 'tab', 'ripple', `ripple-${rippleColor}`);
    t.style.setProperty('--level', nestLevel);

    const span = document.createElement('span');
    span.classList.add('tab-content');
    span.innerHTML = innerHTML;
    t.appendChild(span);
    
    // Add arrow to dropdowns
    if (isDropdown) {
        
        const arrow = FlipArrow.createArrow();
        t.appendChild(arrow);
        t.addEventListener('click', () => {
            FlipArrow.toggleArrow(arrow);
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
    i.className = 'tab-list-item';
    return i;
}

function setDropdownState(t, isOpen) {
    const arrow = t.querySelector(`svg`);
    const path = t.getAttribute('data-path');
    
    if (isOpen) {
        FlipArrow.setArrowFlip(true, arrow);
        StorageHelper.addToStorageList('show-states', path);
    } else {
        FlipArrow.setArrowFlip(false, arrow);
        StorageHelper.removeFromStorageList('show-states', path);
    }
}
function expandTabListTree(tabList) {
    const lists = tabList.querySelectorAll('.tab-list');
    
    lists.forEach(list => {
        list.classList.add('show');
        
        const items = list.querySelectorAll('.tab-list-item');
        items.forEach(item => {
            const tabs = item.querySelectorAll('.tab');
            tabs.forEach((tab) => {
                Tab.setDropdownState(tab, true);
            });
        });
    });
}


function collapseTabListTree(tabList) {
    const lists = tabList.querySelectorAll('.tab-list');
    
    lists.forEach(list => {
        list.classList.remove('show');
        
        const items = list.querySelectorAll('.tab-list-item');
        items.forEach(item => {
            const tabs = item.querySelectorAll('.tab');
            tabs.forEach(tab => {
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
                    // StorageHelper.removeFromStorageList('show-states', t.getAttribute('data-path'));
            });
        }

        return;
    }

    if (isActive) t.classList.add('active');
    else t.classList.remove('active');
}

export function isDropdownTab(t) { return (t.parentElement.querySelector('.tab-list') !== null); }
export function getTabDropdown(t) { return t.parentElement.querySelector('.tab-list') || null; }
export function getTabParentDropdown(t) { return t.parentElement.parentElement || null; }