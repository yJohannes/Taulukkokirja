import { initTableHighlights } from './tables.js';
import { initLatex } from '../latex/latex.js';
import { addRippleToElement } from '../effects/ripple.js';
import { updateBookmarks } from './bookmarks/index.js';
import * as storage from './storage/index.js';

export function sanitizePath(path) {
    path = decodeURIComponent(path);
    path = path.replace('#/', '').replaceAll('_', ' ').replace('.html', '');
    return path;
}

export function formatPathToHash(path) {
    path = 'pages/' + path.replace('pages/', '');
    return '/#/' + path.replaceAll(' ', '_').replace('.html', '')
}

function formatLocationHashForFetch(hash) {
    hash = decodeURIComponent(hash);
    hash = hash
        .replace('#/', '')
        .replaceAll('_', ' ');
    
    if (!hash) return '';

    return hash += '.html';
}

function setPageTitleFromPath(path) {
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

async function loadPageHTML(path)
{
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

async function loadPageToElement(path, elementId, bookMarkable=true)
{
    path = 'pages/' + path.replace('pages/', '');

    const html = await loadPageHTML(path);
    if (!html) return;

    const element = document.getElementById(elementId);
    element.innerHTML = html;
    
    const headerContainer = element.querySelector('.sticky-page-header');
    const wrapper = headerContainer.querySelector('.flex-wrapper');
    wrapper.style.flexDirection = 'row';
    wrapper.style.justifyContent = 'space-between';
    
    if (bookMarkable) {
        const bookmark = document.createElement('i');
        const bookmarks = storage.getFromStorageList('bookmarks');
        
        if (bookmarks.includes(path)) {
            bookmark.classList.add('bi', 'bi-bookmark-fill');
        } else {
            bookmark.classList.add('bi', 'bi-bookmark');
        }
        
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-no-box-shadow', 'button-with-icon', 'rounded-circle', 'ripple', 'ripple-dark', 'ripple-centered', 'hover-glow');
        addRippleToElement(button);
        
        button.addEventListener('click', () => {
            if (bookmark.classList.toggle('bi-bookmark')) {
                storage.removeFromStorageList('bookmarks', path)
            }
            
            if (bookmark.classList.toggle('bi-bookmark-fill')) {
                storage.addToStorageList('bookmarks', path, true)
            }

            updateBookmarks();
        });
        button.appendChild(bookmark);
        wrapper.appendChild(button);
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
    
    const newUrl = formatPathToHash(path);
    history.pushState(null, '', newUrl);
    
    setPageTitleFromPath(path);
    initLatex();
    initTableHighlights();
    injectScripts();
}

function initPageLoading()
{
    const loadUrl = () => {
        const url = formatLocationHashForFetch(window.location.hash);

        if (!url || url === '/') {
            fetch('index.html');
            return;
        }
    
        loadPageToElement(url, 'page-container');
        setPageTitleFromPath(url);
    }

    window.addEventListener('popstate', () => {
        console.log("POPSTATE");
        // loadUrl();
    });
    
    window.addEventListener('load', () => {
        console.log("LOAD");
        loadUrl();
    });

    window.addEventListener('hashchange', () => {
        console.log("HASH CHANGE")

        // loadUrl();
    });
}

export {
    loadPageToElement,
    initPageLoading,
};