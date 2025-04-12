async function loadExplorerUL()
{
    //         <div class="dropdown mr-2 mb-2 d-inline-block">


    // <li class="list-item article-list-item" data-id="13730064425382" data-type="document">
    // 	<div class="list-item-button">Määritelmiä</div>
    // </li>

    try {
        const response = await fetch('/api/pages-structure');

        if (!response.ok) {
            console.error("Failed to fetch the page structure");
            return;
        }

        const structure = await response.json();

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
                const isActive = tab.classList.contains('active')

                // Handle basic tabs
                if (!isDropdown) {
                    if (isActive) {
                        return;
                    } else {
                        document.querySelectorAll('.explorer-tab').forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                        return;
                    }
                }

                // If dropdown is open, Ccose and transfer active tab 1 level up.
                const parentTab = tab.closest('ul').closest('li').querySelector('div'); // Find parent tab (div)
                const childTabs = tab.closest('li').querySelectorAll('ul > li > div'); // Finds child tabs
                console.log(parentTab)
                console.log(childTabs)

                // const activeChildren = tab.querySelectorAll('.active');
                // console.log(activeChildren)
                
                for (const child of tab.children) {
                    if (child.classList.contains('active')) {
                    }
                }

                // Tab is being closed, don't set as active
                // but rather set the parent as active
                if (activeChildren.length > 0) {
                    // const parentTab = tab.closest('.explorer-tab');
                    const parentTab = tab.parentElement;
                    parentTab.classList.add('active');
                } else {
                    document.querySelectorAll('.explorer-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                }
                
            });
            
            if (isDropdown) {
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", "m7 14 5-5 5 5z");  // Traces an arrowS
                
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

        // Recursive function to generate the buttons list with collapsibility
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
                    tab = newTab(pageName, level, true);   // Dropdown tab
                } else {
                    tab = newTab(pageName, level, false);  // Normal tab
                    currentPath = currentPath.slice(0, -1); // Remove trailing '/'
                    
                    tab.addEventListener('click', function() {
                        // window.location.href = pageName;
                        loadPageToElement(currentPath, 'main-content');
                    })
                }

                li.appendChild(tab);

                // If the value is an object (i.e., nested menu), recursively create a nested menu
                if (typeof data[key] === 'object' && data[key] !== null) {
                    const nestedMenu = generateTabs(data[key], currentPath);
                    nestedMenu.classList.add("explorer-dropdown");  // Add class to style the nested menu
                    li.appendChild(nestedMenu);
                    
                    // Add click event listener to toggle the visibility of the nested menu
                    tab.addEventListener('click', function () {
                        nestedMenu.classList.toggle("show");
                    });
                }

                ul.appendChild(li);
            }

            return ul;
        }

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
    console.log(ul);

    const element = document.getElementById(elementId);
    element.appendChild(ul);

    loadRipple();

}