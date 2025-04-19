import { loadPageToElement } from './pages.js';
import { showSidebar }  from './sidebar.js';

const ACTIVE = 'active';
const SHOW = 'show';
const ARROW_FLIPPED = 'flipped';

function createArrow()
{
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "m7 14 5-5 5 5z");  // Traces a neat arrow
    
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrow.classList.add('flip-arrow');
    arrow.setAttribute("viewBox", "0 0 24 24");
    arrow.appendChild(path);

    return arrow;
}

function expandExplorer()
{
    const explorer = document.querySelector('#explorer-container');
    const uls = explorer.querySelectorAll('.explorer-ul');
    
    // Expand all dropdowns and flip arrows
    uls.forEach(ul => {
        ul.classList.add(SHOW);
        
        const lis = ul.querySelectorAll('li');
        lis.forEach((li) => {
            const tabs = li.querySelectorAll('.explorer-tab');
            tabs.forEach((tab) => {
                localStorage.setItem(tab.getAttribute('data-path'), 'show');

                const arrowSvg = tab.querySelector(`svg`);
                if (arrowSvg) {
                    arrowSvg.classList.add(ARROW_FLIPPED);
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
        ul.classList.remove(SHOW);
        
        
        const lis = ul.querySelectorAll('li');
        lis.forEach((li) => {
            const tabs = li.querySelectorAll('.explorer-tab');
            tabs.forEach((tab) => {
                localStorage.removeItem(tab.getAttribute('data-path'))
                tab.classList.remove(ACTIVE);
                
                const arrowSvg = tab.querySelector(`svg`);
                if (arrowSvg) {
                    arrowSvg.classList.remove(ARROW_FLIPPED);
                }
            });
        });
    });
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
                    dropdown?.classList.add(SHOW);

                    const arrowSvg = tab.querySelector(`svg`);
                    if (arrowSvg) {
                        arrowSvg.classList.add(ARROW_FLIPPED);
                    }
                }
            });
        });
    });
}

function handleTabClick(tab, isDropdown, parentElement)
{
    const activeTabs = parentElement.querySelectorAll(`.${ACTIVE}`);

    // Handle basic tabs
    if (!isDropdown) {
        if (tab.classList.contains(ACTIVE)) return;  // Clicked the current tab

        activeTabs.forEach(t => {
            t.classList.remove(ACTIVE);
            localStorage
        });
        tab.classList.add(ACTIVE);

        // If tab is clicked on small screen hide sidebar
        showSidebar(false);
        return;
    }

    // Handle collapsible tabs
    const nestedDropdown = tab.parentElement.querySelector('ul');
    activeTabs.forEach(t => t.classList.remove(ACTIVE));

    // If closing a dropdown, shift focus up a level
    if (nestedDropdown.classList.contains(SHOW)) {
        nestedDropdown.classList.remove(SHOW);
        localStorage.removeItem(tab.getAttribute('data-path'))


        const parentDropdown = tab.parentElement.parentElement;
        const parentTab = parentDropdown.parentElement.querySelector('div');

        // Dismiss highest level dropdown
        if (!(parentDropdown.parentElement.id === 'explorer-container')) {
            parentTab.classList.add(ACTIVE);
            localStorage.setItem(parentTab.getAttribute('data-path'), 'show');
        }

    } else {
        const autoCollapse = document.getElementById('explorer-auto-collapse')
        const autoCollapseOn = autoCollapse.classList.contains(ACTIVE);
        
        if (autoCollapseOn) {
            const parentDropdown = tab.parentElement.parentElement;

            const openDropdown = parentDropdown.querySelectorAll(`.${SHOW}`);
            openDropdown.forEach(m => {
                m.classList.remove(SHOW);
                
                const tab = m.parentElement.querySelector('div');
                const arrow = tab.querySelector('svg');
                arrow.classList.remove(ARROW_FLIPPED);
                localStorage.removeItem(tab.getAttribute('data-path'))
            });
        }

        // Set tab as active and show contents
        tab.classList.add(ACTIVE);
        localStorage.setItem(tab.getAttribute('data-path'), 'show');

        nestedDropdown.classList.add(SHOW);
    }
}

function initExplorerButtons()
{
    const config = {
        delay: { show: 500, hide: 200 },
        animation: true,
        trigger: 'hover'  // No persisting tooltips
    }

    const expand = document.getElementById('explorer-expand')
    const collapse = document.getElementById('explorer-collapse')
    const autoCollapse = document.getElementById('explorer-auto-collapse')

    for (let b of [expand, collapse, autoCollapse]) {
        b.setAttribute('data-toggle', 'tooltip');
        b.setAttribute('data-placement', 'top');
        $(b).tooltip(config);
    }
    
    const savedState = localStorage.getItem('explorer-auto-collapse-state');
    if (savedState === "true") {
        autoCollapse.classList.add(ACTIVE);
    }

    autoCollapse.addEventListener('click', () => {
        autoCollapse.classList.toggle(ACTIVE);
        localStorage.setItem("explorer-auto-collapse-state", autoCollapse.classList.contains(ACTIVE));
    });

    expand.addEventListener('click', () => {
        expandExplorer();
    });

    collapse.addEventListener('click', () => {
        collapseExplorer();
    });
}

function newTab(text, level, isDropdown, parentElement)
{
    const tab = document.createElement('div');
    tab.classList.add("btn", "btn-light", "btn-no-focus", "explorer-tab", "ripple");
    tab.style.setProperty('--level', level);

    if (level === 0) tab.style.fontWeight = 'bold';

    const span = document.createElement('span');
    span.innerText = text;
    tab.appendChild(span);

    tab.addEventListener('click', () => handleTabClick(tab, isDropdown, parentElement))
    
    // Add arrow to dropdowns
    if (isDropdown) {
        tab.classList.add('flip-arrow-container');
        tab.addEventListener('click', () => {

            arrow.classList.toggle(ARROW_FLIPPED);
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
            tab = newTab(pageName, level, true, parentElement);    // Dropdown tab

        } else {
            currentPath = currentPath.slice(0, -1);  // Remove trailing '/'
            tab = newTab(pageName, level, false, parentElement);   // Normal tab
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

async function loadExplorerUL(parentElement)
{
    try {
        const response = await fetch('/api/pages-structure');

        if (!response.ok) {
            console.error("Failed to fetch the page structure");
            return;
        }

        const structure = await response.json();

        const tabs = generateTabs(structure, parentElement);
        return tabs;

    } catch (error) {
        console.error('Failed to fetch the page structure: ', error);
    }

    return null;
};

// // window.onload = loadHierarchy; // Load hierarchy when the page loads
// window.getHierarchyHTML = getHierarchyHTML;
async function loadExplorerToElement(element)
{    
    const ul = await loadExplorerUL(element);
    element.appendChild(ul);
    
    initExplorerButtons();
}

export {
    createArrow,
    loadExplorerToElement,
    loadExplorerUL,
    loadExplorerSave,
    expandExplorer,
    collapseExplorer,
};