import { initTableHighlights } from './tables.js';
import { initLatex } from './latex.js';


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

// Create an async function to load the page and set the content
async function loadPageToElement(path, elementId)
{
    const html = await loadPageHTML(path);

    const element = document.getElementById(elementId);
    element.innerHTML = html;

    initLatex();
    initTableHighlights();
}

function initPageLoading()
{
    const loadUrl = () => {
        let url = window.location.hash.replaceAll('-', ' ').replace('#/', '');
    
        if (url === '/' || url === '') {
            return;
        }
    
        if (!url.endsWith('.html')) {
            url += '.html'
        }
    
        loadPageToElement(`/pages/${url}`, 'page-container');
    }

    window.addEventListener('popstate', () => {
        console.log("POPSTATE");
        loadUrl();
    });
    
    window.addEventListener('load', () => {
        console.log("LOAD");
        loadUrl();
        document.title = window.location.hash.split('/').pop() + ' | Kaavakirja';
    });

    window.addEventListener('hashchange', () => {
        console.log("HASH CHANGE")
        console.log(window.location.hash)

        loadUrl();
        document.title = window.location.hash.split('/').pop() + ' | Kaavakirja';
    });
}

export { loadPageToElement, initPageLoading };