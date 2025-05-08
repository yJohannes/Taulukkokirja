import { initTableHighlights } from './tables.js';
import { initLatex } from '../latex/latex.js';
import { addRippleToElement } from '../effects/ripple.js';
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
    const html = await loadPageHTML(path);

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
                storage.addToStorageList('bookmarks', path)
            }
            
        });
        button.appendChild(bookmark);
        wrapper.appendChild(button);
    }

    injectScripts();
    
    const newUrl = formatPathToHash(path);
    history.pushState(null, '', newUrl);
    setPageTitleFromPath(path);

    initLatex();
    initTableHighlights();
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
        loadUrl();
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

export {
    loadPageToElement,
    initPageLoading,
    formatPathToHash
};