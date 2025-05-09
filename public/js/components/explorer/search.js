import { loadPageToElement } from '../pages.js';
import { addRippleToElement } from '../../effects/ripple.js';
import { updateBookmarks } from '../bookmarks/index.js';
import * as explorer from './index.js'
import * as search from '../search/index.js';

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
// function searchInStructure(structure, searchString, path = '') {
//     let matches = [];
//     const lowerSearchString = searchString.toLowerCase();

//     for (const key in structure) {
//         if (structure.hasOwnProperty(key)) {
//             const lowerKey = key.toLowerCase();
//             const currentPath = path ? `${path}/${key}` : key;

//             // Check if the key matches the search string
//             if (lowerKey.includes(lowerSearchString)) {
//                 matches.push(currentPath);
//             }

//             // If the value is an object, search recursively
//             if (typeof structure[key] === 'object' && structure[key] !== null) {
//                 matches = matches.concat(searchInStructure(structure[key], searchString, currentPath));
//             }
//         }
//     }

//     return matches;
// }

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

    const maxScore = Math.max(...matches.map(r => r.score));
    // let maxScore = 0;
    // for (const match of matches) {
        // if (match.score > maxScore) maxScore = match.score;
    // }

    function getHeatColor(score, max) {
        const t = score / max; // Normalize to [0, 1]
        
        // Map to HSL (red to green, or reverse)
        const hue = t * 120;  // red to red (or go to green if you want: (1 - t) * 120)
        const saturation = 100;
        const lightness = 50 + 20 * (1 - t); // lighter for low scores

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    for (const match of matches) {
        const path = match.id;
        const score = match.score.toFixed(2);

        let $tab;
        if (path.endsWith('.html')) {
            const name = explorer.formatPathLabel(path);

            $tab = explorer.createTab(name, 0, false, path);

            $tab.addEventListener('click', (e) => {

                if (e.button === 0) {
                    loadPageToElement(path, 'page-container');
                }

                updateBookmarks();
            });

            // Right click
            $tab.addEventListener('contextmenu', (e) => {
                e.preventDefault();

                $container.innerHTML = '';
                explorer.showExplorer(true);
                showResults(false);

                const parentPath = path.substring(0, path.lastIndexOf('/'));

                explorer.openPath(parentPath);
                explorer.getTabByPath(parentPath).scrollIntoView({
                    behavior: 'auto',     // smooth scrolling animation
                    block: 'center',        // align element to center of the viewport
                });

                clearSearch();
            });
        } else {
            const name = explorer.formatPathLabel(path);

            $tab = explorer.createTab(name, 0, false, path);
            $tab.addEventListener('click', () => {
                $container.innerHTML = '';
                explorer.showExplorer(true);
                showResults(false);

                explorer.openPath(path);
                explorer.getTabByPath(path).scrollIntoView({
                    behavior: 'auto',     // smooth scrolling animation
                    block: 'center',        // align element to center of the viewport
                });

                clearSearch();
            });
        }

        $tab.style.setProperty('padding', '0.75rem', 'important');
        addRippleToElement($tab);

        const color = getHeatColor(match.score, maxScore);
        const $circle = document.createElement('div');
        $circle.innerText = match.score.toFixed(0);

        Object.assign($circle.style, {
            position: 'absolute',
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px',
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',

            backgroundColor: color,
            top: '50%',
            transform: 'translateY(-50%)',
            right: '-1px',
        });

        // Attach circle inside the button (relative positioning required)
        $tab.appendChild($circle);
        $container.appendChild($tab);
    }
}

function onValueChanged(event) {
    const query = event.target.value;
    const $searchIcon = document.getElementById('explorer-search-icon');
    const $clearIcon = document.getElementById('explorer-clear-search');

    if (query.length <= 0) {
        explorer.showExplorer(true);
        showResults(false);
        
        $searchIcon.style.display = 'inline';
        $clearIcon.style.display = 'none';
        
        return;
    }

    explorer.showExplorer(false);
    showResults(true);

    $searchIcon.style.display = 'none';
    $clearIcon.style.display = 'flex';
    
    const results = search.search(query);
    generateResultView(results, document.getElementById('search-container'))
}

async function initSearchToInput($element)
{
    $element.addEventListener('input', onValueChanged);

    const $clear = document.getElementById('explorer-clear-search');
    const $search = document.getElementById("explorer-search");
    
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