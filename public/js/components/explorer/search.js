import { getHeatColor, normalization } from '../../common/colors.js';
import { updateBookmarks } from '../bookmarks/index.js';
import * as explorer from './index.js';
import * as search from '../search/index.js';
import * as pages from '../../pages/index.js';
import { highlightTerms } from '../../effects/highlight-terms.js';

function clearSearch() {
    document.querySelector("#explorer-search").value = '';
}

function showResults(bool) {
    const searchContainer = document.getElementById('explorer-search-result-container');

    if (bool) {
        searchContainer.style.display = 'inline-block';
    } else {
        searchContainer.style.display = 'none';
    }
}

export function generateResultView(container, matches) {
    container.innerHTML = '';
    container.innerHTML += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; padding-left: 0.75rem; padding-right: 0;">
            <p style="margin: 0"><b>Haun tulokset</b></p>
            <h4><span class="badge">            
                ${matches.length} osumaa
            </span></h4>
        </div>
        `

    if (matches.length === 0) {
        container.innerHTML += '<p style="padding-left: 1rem;">Ei tuloksia</p>'
        return;
    }

    const maxScore = Math.max(...matches.map(r => r.score));

    for (const match of matches) {
        const path = match.id;
        const score = match.score.toFixed(1); Math.round(match.score);
        const heatColor = getHeatColor(match.score, maxScore, normalization.log);

        let tab;
        if (path.endsWith('.html')) {
            const name = explorer.formatPathLabel(path);

            tab = explorer.createTab(name, 0, false, path);
            
            const tabHref = tab.getAttribute('href');
            tab.setAttribute('href', tabHref + `?highlight=${pages.encodeSearchParams(match.terms)}`)

            tab.addEventListener('click', (e) => {
                updateBookmarks();
            });

            // Right click
            tab.addEventListener('contextmenu', (e) => {
                e.preventDefault();

                container.innerHTML = '';
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

            tab = explorer.createTab(name, 0, false, path);
            tab.addEventListener('click', () => {
                container.innerHTML = '';
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

        tab.style.setProperty('padding', '0.75rem', 'important');
        tab.style.setProperty('padding-right', '3rem', 'important');

        const scoreBadge = document.createElement('div');
        scoreBadge.innerText = score;

        Object.assign(scoreBadge.style, {
            position: 'absolute',
            right: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'black',

            borderRadius: '4px',
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px',
            paddingTop: '0.1rem',
            paddingBottom: '0.1rem',
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',

            backgroundColor: heatColor,
        });

        tab.appendChild(scoreBadge);
        container.appendChild(tab);
    }
}

export async function initSearchToInput(element) {
    const searchBar = document.getElementById("explorer-search");
    const resultContainer = document.getElementById('explorer-search-result-container');

    element.addEventListener('input', (e) => {
        const query = e.target.value;
        
        if (query.length <= 0) {
            explorer.showExplorer(true);
            showResults(false);
        } else {
            explorer.showExplorer(false);
            showResults(true);
            
            const matches = search.search(query);
            generateResultView(resultContainer, matches)

            //  Highlight titles in search
            if (matches) {
                const titleMatches = search.search(query, { boost: { title: 2, content: 0 } })
    
                // Merge all matched terms to avoid redundant highlighting
                const uniqueTerms = [...new Set(titleMatches.flatMap(m => m.terms))];
                highlightTerms(resultContainer, uniqueTerms);
            }
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.altKey && event.key === "s") {
            event.preventDefault();
            if (searchBar) {
                searchBar.focus();
            }
        }
    });
}