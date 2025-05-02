import { initTableHighlights } from './tables.js';
import { initLatex } from '../latex/latex.js';
import { addRippleToElement } from '../effects/ripple.js';


function formatPathToHash(path) {
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

function getBookmarks() {
    let bookmarks = localStorage.getItem('bookmarks');
    if (!bookmarks) {
        bookmarks = '[]';
    }

    bookmarks = JSON.parse(bookmarks);
    return bookmarks;
}

function setBookmark(pagePath) {
    let bookmarks = getBookmarks();

    if (!bookmarks.includes(pagePath)) {
        bookmarks.push(pagePath);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function removeBookmark(pagePath) {
    let bookmarks = getBookmarks();

    const index = bookmarks.indexOf(pagePath);
    if (index !== -1) {
        bookmarks.splice(index, 1);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
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
        const bookmarks = getBookmarks();
        
        if (bookmarks.includes(path)) {
            bookmark.classList.add('bi', 'bi-bookmark-fill');
        } else {
            bookmark.classList.add('bi', 'bi-bookmark');
        }
        
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-no-box-shadow', 'button-with-icon', 'rounded-circle', 'ripple', 'ripple-dark', 'ripple-centered')
        addRippleToElement(button);
        
        button.addEventListener('click', () => {
            if (bookmark.classList.toggle('bi-bookmark')) {
                removeBookmark(path);
            }
            
            if (bookmark.classList.toggle('bi-bookmark-fill')) {
                setBookmark(path);
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