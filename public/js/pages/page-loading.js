import { initLatex } from '../latex/latex.js';
import { updateBookmarks } from '../components/bookmarks/index.js';
import { highlightTerms } from '../effects/highlight-terms.js';
import * as storage from '../components/storage/index.js';
import * as pages from './index.js';

// Execute any inline scripts within injected HTML
// Scripts will get the class 'injected' 

// DOES NOT WORK
function injectPageScripts($pageContainer) {
    document.querySelectorAll('script.injected').forEach(script => {
        script.remove();
    });

    const scripts = $pageContainer.querySelectorAll('script');
    scripts.forEach(script => {
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

    recents.unshift(path); // Add the new path to the front of the array (index 0)
    
    // If there are more than 20 items, remove the oldest item (last item in array)
    if (recents.length > 20)
        recents.pop();

    storage.setStorageItem('recently-viewed', recents);
}

export function setPageTitleFromPath(path) {
    const splitPath = path.split('/');
    let pageName = splitPath.pop().replace('.html', '');
    let folderName = splitPath.pop();
    
    pageName = decodeURIComponent(pageName);
    
    if (folderName) {
        folderName = decodeURIComponent(folderName);
        pageName ? document.title = pageName + ' | ' + folderName + ' | Taulukkokirja' : document.title = 'Taulukkokirja';
    } else {
        pageName ? document.title = pageName + ' | Taulukkokirja' : document.title = 'Taulukkokirja';
    }
}

export async function loadPageHTML(path) {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            return "Error loading page";
        }
        const html = await response.text();

        return html;
    } catch (error) {
        console.error('Error loading page:', error);
        return 'Error loading page';
    }
}

export async function loadPageToElement(path, $element, bookMarkable=true)
{
    if (!path.endsWith('.html')) {
        explorer.openPath(path);
    }

    const html = await loadPageHTML(path);
    if (!html || html === 'Error loading page') {
        $element.innerHTML = html;
        return
    };

    $element.innerHTML = html;
    
    const $headerContainer = $element.querySelector('.sticky-header');
    const $wrapper = $headerContainer.querySelector('.d-flex');
    $wrapper.style.flexDirection = 'row';
    $wrapper.style.justifyContent = 'space-between';
    $wrapper.style.alignItems = 'center';
    
    if (bookMarkable) {
        const $button = createBookmarkButton();
        $wrapper.appendChild($button);
    }

    setPageTitleFromPath(path);
    initLatex();
    injectPageScripts($element);
    // initTableHighlights();
    updateHistory(path);
}

async function loadHashUrl() {
    let url = pages.formatLocationHashForFetch(window.location.hash);

    if (!url || url === '/') {
        fetch('index.html');
        return;
    }

    await loadPageToElement(url, document.getElementById('page-container'));
    setPageTitleFromPath(url);

    const terms = pages.getDecodedSearchParams('highlight');
    if (terms.length > 0) {
        highlightTerms(document.getElementById('page-container'), terms);
    }
}

export function initPageLoading()
{
    window.addEventListener('load', () => {
        loadHashUrl();
    });

    window.addEventListener('hashchange', () => {
        loadHashUrl();
    });
}

export function createBookmarkButton(pagePath) {
    const $button = document.createElement('button');
    $button.classList.add('btn', 'icon-button', 'rounded-circle', 'ripple', 'ripple-dark', 'ripple-centered', 'hover-glow');
    
    const $headerWrapper = document.createElement('h1');
    $headerWrapper.style.margin = '0';
    $headerWrapper.style.color = 'inherit';

    const $icon = document.createElement('i');
    $headerWrapper.appendChild($icon);
    $button.appendChild($headerWrapper);
    $button.addEventListener('click', () => {
        if ($icon.classList.toggle('bi-bookmark')) {
            storage.removeFromStorageList('bookmarks', pagePath)
        }
        
        if ($icon.classList.toggle('bi-bookmark-fill')) {
            storage.addToStorageList('bookmarks', pagePath, true)
        }

        updateBookmarks();
    });

    const bookmarks = storage.getFromStorageList('bookmarks');
    
    if (bookmarks.includes(pagePath)) {
        $icon.classList.add('bi', 'bi-bookmark-fill');
    } else {
        $icon.classList.add('bi', 'bi-bookmark');
    }

    return $button;
}