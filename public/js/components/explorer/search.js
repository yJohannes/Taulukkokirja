import { getHeatColor, normalization } from '../../common/colors.js';
import { updateBookmarks } from '../bookmarks/index.js';
import * as explorer from './index.js';
import * as search from '../search/index.js';
import * as pages from '../../pages/index.js';
import { highlightTerms } from '../../effects/highlight-terms.js';
import { Tab } from '../../../components/tab/tab.js';
import { utils } from '../../common/utils.js';

function clearSearch() {
    document.querySelector("#explorer-search").value = '';
}

export function generateResultView(container, matches) {
    container.innerHTML = '';
    container.innerHTML += `
        <div class="d-flex justify-content-between align-center py-2 ps-1 pe-0">
            <p style="margin: 0"><b>Haun tulokset</b></p>
            <h4><span class="badge">            
                ${matches.length} osumaa
            </span></h4>
        </div>
        `

    if (matches.length === 0) {
        container.innerHTML += '<pre class="ps-1">Ei tuloksia</pre>'
        return;
    }

    const maxScore = Math.max(...matches.map(r => r.score));

    for (const match of matches) {
        const path = match.id;
        const score = match.score.toFixed(1); Math.round(match.score);
        const heatColor = getHeatColor(match.score, maxScore, normalization.log);

        let tab;
        if (path.endsWith('.html')) {
            const name = pages.formatting.formatPathToLabel(path);

            tab = Tab.createTab(name, path);
            
            const tabHref = tab.getAttribute('href');
            tab.setAttribute('href', tabHref + `?highlight=${pages.encodeSearchParams(match.terms)}`)
            tab.addEventListener('click', updateBookmarks);

            // Right click
            tab.addEventListener('contextmenu', (e) => {
                e.preventDefault();

                container.innerHTML = '';
                utils.showElement(true, document.getElementById('explorer-nav-container'));
                utils.showElement(false, document.getElementById('explorer-search-result-container'));

                const parentPath = path.substring(0, path.lastIndexOf('/'));

                explorer.openPath(parentPath);
                explorer.getTabByPath(parentPath).scrollIntoView({
                    behavior: 'auto',     // smooth scrolling animation
                    block: 'center',        // align element to center of the viewport
                });

                clearSearch();
            });
        } else {
            const name = pages.formatting.formatPathToLabel(path);

            tab = tab.createTab(name, path);
            tab.addEventListener('click', () => {
                container.innerHTML = '';
                utils.showElement(true, document.getElementById('explorer-nav-container'));
                utils.showElement(false, document.getElementById('explorer-search-result-container'));

                explorer.openPath(path);
                explorer.getTabByPath(path).scrollIntoView({
                    behavior: 'auto',     // smooth scrolling animation
                    block: 'center',        // align element to center of the viewport
                });

                clearSearch();
            });
        }

        tab.classList.add('p-2', 'pe-5');

        const scoreBadge = document.createElement('div');
        scoreBadge.innerText = score;
        scoreBadge.className = `
            position-absolute
            top-50
            end-0
            translate-middle-y
            text-black
            rounded-start
            px-1
            py-1
        `
        scoreBadge.style.backgroundColor = heatColor;

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
            utils.showElement(true, document.getElementById('explorer-nav-container'));
            utils.showElement(false, document.getElementById('explorer-search-result-container'));
        } else {
            utils.showElement(false, document.getElementById('explorer-nav-container'));
            utils.showElement(true, document.getElementById('explorer-search-result-container'));
            
            const matches = search.search(query);
            generateResultView(resultContainer, matches)

            //  Highlight titles in search
            if (matches.length > 0) {
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