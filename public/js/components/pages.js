import { initTableHighlights } from './tables.js';
import { initLatex } from '../latex/latex.js';


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
        pageName ? document.title =  pageName + ' | ' + folderName + ' | Kaavakirja' : document.title = 'Kaavakirja';
    } else {
        pageName ? document.title = pageName + ' | Kaavakirja' : document.title = 'Kaavakirja';
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

// Create an async function to load the page and set the content
async function loadPageToElement(path, elementId)
{
    const html = await loadPageHTML(path);

    const element = document.getElementById(elementId);
    element.innerHTML = html;

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

export { loadPageToElement, initPageLoading };