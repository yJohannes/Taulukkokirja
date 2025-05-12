import { addRippleToElement } from '../../effects/ripple.js';
import { updateBookmarks } from '../bookmarks/index.js';
import * as explorer from './index.js';
import * as search from '../search/index.js';
import * as pages from '/js/pages/index.js';

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
        const score = match.score.toFixed(1); Math.round(match.score);

        let $tab;
        if (path.endsWith('.html')) {
            const name = explorer.formatPathLabel(path);

            $tab = explorer.createTab(name, 0, false, path);
            $tab.addEventListener('click', (e) => {
                const tabHref = $tab.getAttribute('href');
                $tab.setAttribute('href', tabHref + `?highlight=${pages.encodeSearchParams(match.terms)}`)
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
        $tab.style.setProperty('padding-right', '3rem', 'important');
        addRippleToElement($tab);

        const color = getHeatColor(match.score, maxScore);
        const $scoreBadge = document.createElement('div');
        $scoreBadge.innerText = score;

        Object.assign($scoreBadge.style, {
            position: 'absolute',
            right: '0',
            top: '50%',
            transform: 'translateY(-50%)',

            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px',
            paddingTop: '0.1rem',
            paddingBottom: '0.1rem',
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',

            backgroundColor: color,
        });

        $tab.appendChild($scoreBadge);
        $container.appendChild($tab);
    }
}

function onValueChanged(event) {
    const $searchIcon = document.getElementById('explorer-search-icon');
    const $clearIcon = document.getElementById('explorer-clear-search');
    const query = event.target.value;
    
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