import { initRipple } from './ripple.js';
import { loadPageToElement } from './pages.js';


function initExplorerButtons()
{
    const explorer = document.getElementById('explorer');

    const config = {
        delay: { show: 500, hide: 200 },
        animation: true,
        trigger: 'hover'  // No persisting tooltips
    }

    const expand = document.getElementById('explorer-expand')
    expand.setAttribute('data-toggle', 'tooltip');
    expand.setAttribute('data-placement', 'top');
    $(expand).tooltip(config);

    const collapse = document.getElementById('explorer-collapse')
    collapse.setAttribute('data-toggle', 'tooltip');
    collapse.setAttribute('data-placement', 'top');
    $(collapse).tooltip(config);

    const autoCollapse = document.getElementById('explorer-auto-collapse')
    autoCollapse.setAttribute('data-toggle', 'tooltip');
    autoCollapse.setAttribute('data-placement', 'top');
    $(autoCollapse).tooltip(config);
    
    autoCollapse.addEventListener('click', () => {
        autoCollapse.classList.toggle('active');
    });

    expand.addEventListener('click', () => {
        const uls = explorer.querySelectorAll('.explorer-ul');
    
        // Close all tabs and unflip arrows
        uls.forEach(ul => {
            ul.classList.add('show');
            
            const lis = ul.querySelectorAll('li');
            lis.forEach((li) => {
                const tabs = li.querySelectorAll('.explorer-tab');
                tabs.forEach((tab) => {

                    const arrowSvg = tab.querySelector('svg.flipped');
                    if (arrowSvg) {
                        arrowSvg.classList.add('flipped');
                    }
                });
            });
        });
    });

    collapse.addEventListener('click', () => {
        const uls = explorer.querySelectorAll('.explorer-ul');
    
        // Close all tabs and unflip arrows
        uls.forEach(ul => {
            ul.classList.remove('show');
            
            const lis = ul.querySelectorAll('li');
            lis.forEach((li) => {
                const tabs = li.querySelectorAll('.explorer-tab');
                tabs.forEach((tab) => {
                    tab.classList.remove('active');

                    const arrowSvg = tab.querySelector('svg.flipped');
                    if (arrowSvg) {
                        arrowSvg.classList.remove('flipped');
                    }
                });
            });
        });
    });
}


function newTab(text, level, isDropdown)
{
    const tab = document.createElement('div');
    tab.classList.add("btn", "btn-light", "btn-no-focus", "explorer-tab", "ripple");
    tab.style.setProperty('--level', level);

    if (level === 0) {
        tab.style.fontWeight = 'bold'; // Apply bold styling
    }

    const span = document.createElement('span');
    span.innerText = text;

    tab.appendChild(span);

    tab.addEventListener('click', () => {
        const explorerContainer = document.getElementById('explorer-tabs')
        const activeTabs = explorerContainer.querySelectorAll('.active')

        // Handle basic tabs
        if (!isDropdown) {
            if (tab.classList.contains('active')) {
                return;
            } else {
                activeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // If tab is clicked on small screen hide sidebar
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.remove('show');
                return;
            }
        }

        // Handle collapsible tabs
        activeTabs.forEach(t => t.classList.remove('active'));
        const nestedMenu = tab.parentElement.querySelector('ul');

        if (nestedMenu.classList.contains('show')) {
            nestedMenu.classList.remove('show');

            const parentMenu = tab.parentElement.parentElement;
            const parentTab = parentMenu.parentElement.querySelector('div');

            // Dismiss highest level menu
            if (!(parentMenu.parentElement.id === 'explorer-tabs'))
            {
                parentTab.classList.add('active');
            }

        } else {
            const autoCollapse = document.getElementById('explorer-auto-collapse')
            const autoCollapseOn = autoCollapse.classList.contains('active');
            
            if (autoCollapseOn) {
                const parentMenu = tab.parentElement.parentElement;
                console.log(parentMenu);

                const openMenu = parentMenu.querySelectorAll('.show');
                openMenu.forEach(m => {
                    m.classList.remove('show');
                    const tab = m.parentElement.querySelector('div');
                    const arrow = tab.querySelector('svg');
                    arrow.classList.remove('flipped');
                });
            }

            // Set tab as active and show contents
            tab.classList.add('active');
            nestedMenu.classList.add("show");
        }
    });
    
    if (isDropdown) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "m7 14 5-5 5 5z");  // Traces an arrow
        
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        arrow.classList.add('explorer-arrow');
        arrow.setAttribute("viewBox", "0 0 24 24");
        arrow.appendChild(path);
        
        tab.classList.add('explorer-arrow-container');

        tab.addEventListener('click', () => {

            arrow.classList.toggle('flipped');
        });

        tab.appendChild(arrow);

    }

    return tab;
}

// Recursive function to generate the tab list with collapsibility
function generateTabs(data, rootPath="") {
    const ul = document.createElement('ul');
    ul.classList.add("explorer-ul");

    for (let key in data) {
        let currentPath = rootPath + key + "/";

        const pageName = key
            .replaceAll("_", " ")
            .replace(".html", "");

        const li = document.createElement('li');

        let tab; 
        const level = currentPath.split('/').length - 2;
        if (typeof data[key] === 'object' && data[key] !== null) {
            tab = newTab(pageName, level, true);    // Dropdown tab
        } else {
            tab = newTab(pageName, level, false);   // Normal tab
            currentPath = currentPath.slice(0, -1); // Remove trailing '/'
            
            tab.addEventListener('click', function() {
                // window.location.href = pageName;
                loadPageToElement(currentPath, 'page-container');
            })
        }

        li.appendChild(tab);

        // If the value is an object (i.e., nested menu), recursively create a nested menu
        if (typeof data[key] === 'object' && data[key] !== null) {
            const nestedMenu = generateTabs(data[key], currentPath);
            nestedMenu.classList.add("explorer-dropdown");  // Add class to style the nested menu
            li.appendChild(nestedMenu);
        }

        ul.appendChild(li);
    }

    return ul;
}

async function loadExplorerUL()
{
    try {
        const response = await fetch('/api/pages-structure');

        if (!response.ok) {
            console.error("Failed to fetch the page structure");
            return;
        }

        const structure = await response.json();


        const tabs = generateTabs(structure);
        return tabs;

    } catch (error) {
        console.error('Failed to fetch the page structure: ', error);
    }

    return null;
};

// // window.onload = loadHierarchy; // Load hierarchy when the page loads
// window.getHierarchyHTML = getHierarchyHTML;
async function loadExplorerToElement(elementId)
{
    const ul = await loadExplorerUL();
    
    const element = document.getElementById(elementId);
    element.appendChild(ul);
    
    initExplorerButtons();
    initRipple();
}

export { loadExplorerToElement };