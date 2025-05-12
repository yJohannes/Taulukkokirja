import { initTableHighlights } from '/js/components/tables.js';
import { initLatex } from '/js/latex/latex.js';
import { addRippleToElement } from  '/js/effects/ripple.js';
import { updateBookmarks } from '/js/components/bookmarks/index.js';
import { highlightTerms } from '../effects/highlight-terms.js';
import * as storage from '/js/components/storage/index.js';
import * as pages from './index.js';

// Execute any inline scripts within injected HTML
// Scripts will get the class 'injected' 
function injectScripts() {
    document.querySelectorAll('script.injected').forEach(script => {
        script.remove();
    });

    const scripts = document.querySelectorAll('#page-container script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.classList.add('injected');
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
    });
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
    try
    {
        const response = await fetch(path);

        if (!response.ok) {
            return "Error loading page";
        }
        const html = await response.text();

        return html;
    }
    catch (error)
    {
        console.error('Error loading page:', error);
        return 'Error loading page';
    }
}

export async function loadPageToElement(path, elementId, bookMarkable=true)
{
    console.log('Loading page to element')

    if (!path.endsWith('.html')) {
        explorer.openPath(path);
    }

    const html = await loadPageHTML(path);
    if (!html || html === 'Error loading page') {
        const $element = document.getElementById(elementId);
        $element.innerHTML = html;
        return
    };

    const $element = document.getElementById(elementId);
    $element.innerHTML = html;
    
    const $headerContainer = $element.querySelector('.sticky-page-header');
    const $wrapper = $headerContainer.querySelector('.d-flex');
    $wrapper.style.flexDirection = 'row';
    $wrapper.style.justifyContent = 'space-between';
    
    if (bookMarkable) {
        const $button = document.createElement('button');
        $button.classList.add('btn', 'button-with-icon', 'rounded-circle', 'ripple', 'ripple-dark', 'ripple-centered', 'hover-glow');
        addRippleToElement($button);
        
        const $icon = document.createElement('i');
        $button.appendChild($icon);

        $button.addEventListener('click', () => {
            if ($icon.classList.toggle('bi-bookmark')) {
                storage.removeFromStorageList('bookmarks', path)
            }
            
            if ($icon.classList.toggle('bi-bookmark-fill')) {
                storage.addToStorageList('bookmarks', path, true)
            }

            updateBookmarks();
        });

        const bookmarks = storage.getFromStorageList('bookmarks');
        
        if (bookmarks.includes(path)) {
            $icon.classList.add('bi', 'bi-bookmark-fill');
        } else {
            $icon.classList.add('bi', 'bi-bookmark');
        }

        $wrapper.appendChild($button);
    }

    const recents = storage.getFromStorageList('recently-viewed');
    let idx = recents.indexOf(path);
    
    // If the path already exists, remove it
    if (idx !== -1)
        recents.splice(idx, 1);

    recents.unshift(path); // Add the new path to the front of the array (index 0)
    
    // If there are more than 20 items, remove the oldest item (last item in array)
    if (recents.length + 1 > 10)
        recents.pop();

    storage.setStorageItem('recently-viewed', recents);
    
    setPageTitleFromPath(path);
    initLatex();
    initTableHighlights();
    injectScripts();
}

export function initPageLoading()
{
    const loadUrl = async () => {
        let url = pages.formatLocationHashForFetch(window.location.hash);

        if (!url || url === '/') {
            fetch('index.html');
            return;
        }

        // const newUrl = pages.formatPathToHash(url);
        // history.pushState(null, '', newUrl);
        await loadPageToElement(url, 'page-container');
        setPageTitleFromPath(url);

        const terms = pages.getDecodedSearchParams('highlight');
        if (terms.length > 0) {
            highlightTerms(document.getElementById('page-container'), terms);
        }
    }

    window.addEventListener('popstate', () => {
        // console.log("POPSTATE");
        // loadUrl();
    });
    
    window.addEventListener('load', () => {
        console.log("LOAD");
        loadUrl();
    });

    window.addEventListener('hashchange', () => {
        console.log("HASH CHANGE")
        loadUrl();
    });
}