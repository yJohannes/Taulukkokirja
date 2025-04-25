import { loadPageToElement } from '../pages.js';
import { loadExplorerStructure, openPath, showExplorer } from './explorer.js';
import { createTab } from './tab.js';

import * as defs from './defs.js'

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
            <div class="rounded-pill" style="display: inline-block; white-space: nowrap; background-color: var(--color-primary); color: var(--color-secondary); padding: 0.4rem 0.6rem;">
                ${matches.length} osumaa
            </div>
        </div>

    `

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
            tab.addEventListener('click', () => {
                console.log(`Opening: ${match}`);
                loadPageToElement('pages/' + match, 'page-container');

            });

        } else {
            let name = split[last];
            if (last > 0) {
                name = '<small>' + split[last-1] + '</small> / ' + name;
            }

            name = '<i>' + name + '</i>';

            tab = createTab(name.replace('.html', ''), 1, false, resultContainer);
            tab.addEventListener('click', () => {
                showExplorer(true);
                showResults(false);
                // Make it open the folder
            });
        }


        resultContainer.appendChild(tab);
    }
}

function search(searchString) {

    if (searchString.length <= 0) {
        showExplorer(true);
        showResults(false);
        return;
    }
    showExplorer(false);
    showResults(true);

    if (!explorerStructure) {
        console.error('Explorer structure is not initialized.');
        return;
    }
    const searchContainer = document.getElementById('search-container');

    const matches = searchInStructure(explorerStructure, searchString);
    if (matches.length > 0) {
        console.log('Matches found:', matches);
        generateResultView(matches, searchContainer)
    } else {
        console.log('No matches found for:', searchString);
    }
}

async function initSearchToInput(element)
{
    explorerStructure = await loadExplorerStructure();

    element.addEventListener('input', (event) => {
        search(event.target.value);
    });
}


export {
    initSearchToInput,
    search
}