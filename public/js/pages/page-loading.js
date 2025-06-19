import { StorageHelper } from '../components/storage/index.js';
import { renderElementLatex } from '../latex/latex.js';
import { highlightTerms } from '../effects/highlight-terms.js';
import { Bookmarks } from '../components/bookmarks/bookmarks.js';
import { Pages } from './index.js';

const PAGE_LOAD_ERROR_MESSAGE = 'Error loading page';

export const loading = {
    init,
    fetchPageStructure,
    extractPageStructurePaths,
    loadPageHTML,
    loadPageToElement,
}

function init() {
    window.addEventListener('load', loadHashUrl);
    window.addEventListener('hashchange', loadHashUrl);
}

async function loadHashUrl() {
    let url = Pages.formatting.formatHashToPath(window.location.hash);

    if (!url || url === '/') {
        fetch('index.html');
        return;
    }

    await loadPageToElement(url, document.getElementById('page-container'));
    document.title = Pages.formatting.formatPathToTitle(url);

    const terms = Pages.formatting.getDecodedSearchParams('highlight', location.hash);
    if (terms.length > 0) {
        highlightTerms(document.getElementById('page-container'), terms);
    }
}

async function fetchPageStructure() {
    const response = await fetch('/api/pages-structure');
    if (!response.ok) {
        console.error('Failed to fetch the page structure, using fallback.');
        return defaultStructure;
    }
    
    const structure = await response.json();
    // console.log(structure)
    return structure;
}

function extractPageStructurePaths(obj, basePath = '') {
    const paths = [];
    
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = basePath ? `${basePath}/${key}` : key;
        
        if (value === null) {
            // It's a file
            paths.push(currentPath);
        } else if (typeof value === 'object') {
            // It's a folder
            paths.push(...extractPageStructurePaths(value, currentPath));
        }
    }
    
    return paths;
}

async function loadPageHTML(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`${PAGE_LOAD_ERROR_MESSAGE} (HTTP ${response.status})`);
    }
    return await response.text();
}



async function loadPageToElement(path, element, bookMarkable=true) {
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
    
    document.title = Pages.formatting.formatPathToTitle(path);

    if (bookMarkable) {
        Bookmarks.addBookmarkToHeader(element.querySelector('h1'), path);
    }

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
    const recents = StorageHelper.getFromStorageList('recently-viewed');
    let idx = recents.indexOf(path);
    
    // If the path already exists, remove it
    if (idx !== -1)
        recents.splice(idx, 1);

    recents.unshift(path);
    if (recents.length > 20)
        recents.pop();

    StorageHelper.setStorageItem('recently-viewed', recents);
}