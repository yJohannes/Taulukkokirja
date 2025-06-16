import { renderElementLatex } from '../latex/latex.js';
import { highlightTerms } from '../effects/highlight-terms.js';
import * as bookmarks from '../components/bookmarks/bookmarks.js';
import * as storage from '../components/storage/index.js';
import * as pages from './index.js';

const PAGE_LOAD_ERROR_MESSAGE = 'Error loading page';

export function initPageLoading() {
    window.addEventListener('load', loadHashUrl);
    window.addEventListener('hashchange', loadHashUrl);
}

async function loadHashUrl() {
    let url = pages.formatting.formatHashToPath(window.location.hash);

    if (!url || url === '/') {
        fetch('index.html');
        return;
    }

    await loadPageToElement(url, document.getElementById('page-container'));
    document.title = pages.formatting.formatPathToTitle(url);

    const terms = pages.getDecodedSearchParams('highlight');
    if (terms.length > 0) {
        highlightTerms(document.getElementById('page-container'), terms);
    }
}

export async function loadPageHTML(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`${PAGE_LOAD_ERROR_MESSAGE} (HTTP ${response.status})`);
    }
    return await response.text();
}



export async function loadPageToElement(path, element, bookMarkable=true) {
    try {
        const html = await loadPageHTML(path);
        element.innerHTML = html;
    } catch (error) {
        console.error(error);
        element.innerHTML = `
            <div class="error">
                <h1>Page Load Failed</h1>
                <hr>
                <pre>${error.message || 'Unknown error occurred.'}</pre>
            </div>
        `;
        return;
    }
    
    if (bookMarkable) {
        bookmarks.addBookmarkToHeader(element.querySelector('h1'), path);
    }

    document.title = pages.formatting.formatPathToTitle(path);
    renderElementLatex(document.getElementById('page-container'));
    injectPageScripts(element);
    updateHistory(path);
}


function clearInjectedScripts() {
    document.querySelectorAll('script.injected').forEach(script => script.remove());
}

// Execute any inline scripts within injected HTML
// Scripts will get the class 'injected' 

// DOES NOT WORK


function injectPageScripts(container) {
    clearInjectedScripts()

    container.querySelectorAll('script').forEach(script => {
        const newScript = document.createElement('script');
        newScript.classList.add('injected');
        if (script.src) {
            // Handle external scripts
            newScript.src = script.src;
        } else {
            // Execute inline scripts using innerHTML
            newScript.innerHTML = script.innerHTML;
        }
        document.body.appendChild(newScript);
    });
}

function updateHistory(path) {
    const recents = storage.getFromStorageList('recently-viewed');
    let idx = recents.indexOf(path);
    
    // If the path already exists, remove it
    if (idx !== -1)
        recents.splice(idx, 1);

    recents.unshift(path);
    if (recents.length > 20)
        recents.pop();

    storage.setStorageItem('recently-viewed', recents);
}




