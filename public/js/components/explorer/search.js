import { loadPageToElement } from '../pages.js';
import { addRippleToElement } from '../../effects/ripple.js';
import { updateBookmarks } from '../bookmarks/index.js';
import * as explorer from './index.js'

let explorerStructure = null;

function clearSearch() {
    document.querySelector("#explorer-search").value = '';
}

function showResults(bool) {
    const $searchContainer = document.getElementById('search-container');

    if (bool) {
        $searchContainer.style.display = 'inline-block';
    } else {
        $searchContainer.style.display = 'none';
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

function generateResultView(matches, $container) {
    $container.innerHTML = '';
    $container.innerHTML += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem;">
            <p style="margin: 0"><b>Haun tulokset</b></p>
            <div class="rounded-pill" style="display: inline-block; font-size: 75%; white-space: nowrap; background-color: var(--color-primary); color: var(--color-secondary); padding: 0.4rem 0.6rem;">
                ${matches.length} osumaa
            </div>
        </div>
    `

    if (matches.length === 0) {
        $container.innerHTML += '<p style="padding-left: 1rem;">Ei tuloksia</p>'
        return;
    }

    for (const match of matches) {
        
        let $tab;
        if (match.endsWith('.html')) {
            const name = explorer.formatPathLabel(match);

            $tab = explorer.createTab(name, 0, false, 'pages/' + match);

            $tab.addEventListener('click', (e) => {

                if (e.button === 0) {
                    loadPageToElement('pages/' + match, 'page-container');
                }

                updateBookmarks();
            });

            // Right click
            $tab.addEventListener('contextmenu', (e) => {
                e.preventDefault();

                $container.innerHTML = '';
                explorer.showExplorer(true);
                showResults(false);

                const parentPath = 'pages/' + match.substring(0, match.lastIndexOf('/'));

                explorer.openPath(parentPath);
                explorer.getTabByPath(parentPath).scrollIntoView({
                    behavior: 'auto',     // smooth scrolling animation
                    block: 'center',        // align element to center of the viewport
                });

                clearSearch();
            });
        } else {
            const name = explorer.formatPathLabel(match);

            $tab = explorer.createTab(name, 0, false, 'pages/' + match);
            $tab.addEventListener('click', () => {
                $container.innerHTML = '';
                explorer.showExplorer(true);
                showResults(false);

                explorer.openPath('pages/' + match);
                explorer.getTabByPath('pages/' + match).scrollIntoView({
                    behavior: 'auto',     // smooth scrolling animation
                    block: 'center',        // align element to center of the viewport
                });

                clearSearch();
            });
        }

        addRippleToElement($tab);
        $container.appendChild($tab);
    }
}

function search(searchString) {
    if (searchString.length <= 0) {
        explorer.showExplorer(true);
        showResults(false);
        
        document.getElementById('explorer-search-icon').style.display = 'inline';
        document.getElementById('explorer-clear-search').style.display = 'none';
        
        return;
    }

    explorer.showExplorer(false);
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

async function initSearchToInput($element)
{
    explorerStructure = (await explorer.loadExplorerStructure()).pages;

    $element.addEventListener('input', (event) => {
        search(event.target.value);
    });

    const $clear = document.getElementById('explorer-clear-search');
    const $search = document.querySelector("#explorer-search");
    
    addRippleToElement($clear);

    $clear.addEventListener("click", () => {
        clearSearch();

        // simulate input
        const event = new Event('input', { bubbles: true });
        $search.dispatchEvent(event);

        $search.focus();
    });

    document.addEventListener("keydown", function(event) {
        if (event.altKey && event.key === "s") {
            event.preventDefault();
            if ($search) {
                $search.focus();
            }
        }
    });
}


export {
    initSearchToInput,
    search
}