import { loadPageToElement } from '../pages.js';
import { getTabByPath, loadExplorerStructure, openPath, showExplorer } from './explorer.js';
import { createTab } from './tab.js';
import { addRippleToElement } from '../../effects/ripple.js';

let explorerStructure = null;

function showResults(bool) {
    const searchContainer = document.getElementById('search-container');

    if (bool) {
        searchContainer.style.display = 'inline-block';
    } else {
        searchContainer.style.display = 'none';
    }

}

// Recursively search the explorer structure
function searchInStructure(structure, searchString, path = '') {
    let matches = [];
    const lowerSearchString = searchString.toLowerCase();

    for (const key in structure) {
        if (structure.hasOwnProperty(key)) {
            const lowerKey = key.toLowerCase();
            const currentPath = path ? `${path}/${key}` : key;

            // Check if the key matches the search string
            if (lowerKey.includes(lowerSearchString)) {
                matches.push(currentPath);
            }

            // If the value is an object, search recursively
            if (typeof structure[key] === 'object' && structure[key] !== null) {
                matches = matches.concat(searchInStructure(structure[key], searchString, currentPath));
            }
        }
    }

    return matches;
}

function generateResultView(matches, resultContainer) {
    resultContainer.innerHTML = '';
    resultContainer.innerHTML += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem;">
            <p style="margin: 0"><b>Haun tulokset</b></p>
            <div class="rounded-pill" style="display: inline-block; font-size: 75%; white-space: nowrap; background-color: var(--color-primary); color: var(--color-secondary); padding: 0.4rem 0.6rem;">
                ${matches.length} osumaa
            </div>
        </div>
    `

    if (matches.length === 0) {
        resultContainer.innerHTML += '<p style="padding-left: 1rem;">Ei tuloksia</p>'
        return;
    }

    for (const match of matches) {
        const split = match.split('/')
        const last = split.length - 1;
        
        let tab;
        if (match.endsWith('.html')) {
            let name = '<b>' + split[last] + '</b>';
            if (last > 0) {
                name = '<small><i>' + split[last-1] + '</i></small> / ' + name;
            }

            tab = createTab(name.replace('.html', ''), 1, false, resultContainer);

            tab.addEventListener('click', (e) => {

                if (e.button === 0) {
                    loadPageToElement('pages/' + match, 'page-container');
                }
            });

            // Right click
            tab.addEventListener('contextmenu', (e) => {
                e.preventDefault();

                resultContainer.innerHTML = '';
                showExplorer(true);
                showResults(false);

                const parentPath = match.substring(0, match.lastIndexOf('/'));

                openPath(parentPath);
                getTabByPath(parentPath).scrollIntoView({
                    behavior: 'auto',     // smooth scrolling animation
                    block: 'center',        // align element to center of the viewport
                  });
            });
        } else {
            let name = split[last];
            if (last > 0) {
                name = '<small>' + split[last-1] + '</small> / ' + name;
            }

            name = '<i>' + name + '</i>';

            tab = createTab(name.replace('.html', ''), 1, false, resultContainer);
            tab.addEventListener('click', () => {
                resultContainer.innerHTML = '';
                showExplorer(true);
                showResults(false);

                openPath(match);
                getTabByPath(match).scrollIntoView({
                    behavior: 'auto',     // smooth scrolling animation
                    block: 'center',        // align element to center of the viewport
                  });
            });
        }

        addRippleToElement(tab);
        resultContainer.appendChild(tab);
    }
}

function search(searchString) {

    if (searchString.length <= 0) {
        showExplorer(true);
        showResults(false);
        
        document.getElementById('explorer-search-icon').style.display = 'inline';
        document.getElementById('explorer-clear-search').style.display = 'none';
        
        return;
    }

    showExplorer(false);
    showResults(true);

    document.getElementById('explorer-search-icon').style.display = 'none';
    document.getElementById('explorer-clear-search').style.display = 'flex';
    
    if (!explorerStructure) {
        console.error('Explorer structure is not initialized.');
        return;
    }
    const searchContainer = document.getElementById('search-container');

    const matches = searchInStructure(explorerStructure, searchString);
    generateResultView(matches, searchContainer)
}

async function initSearchToInput(element)
{
    explorerStructure = await loadExplorerStructure();

    element.addEventListener('input', (event) => {
        search(event.target.value);
    });

    const clearBtn = document.getElementById('explorer-clear-search');
    const searchInput = document.querySelector("#explorer-search");
    
    addRippleToElement(clearBtn);

    clearBtn.addEventListener("click", () => {
        searchInput.value = '';

        // simulate input
        const event = new Event('input', { bubbles: true });
        searchInput.dispatchEvent(event);

        searchInput.focus();
    });

    document.addEventListener("keydown", function(event) {
        if (event.altKey && event.key === "s") {
            event.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
}


export {
    initSearchToInput,
    search
}