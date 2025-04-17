import { initTableHighlights } from './tables.js';
import { initLatex } from './latex.js';


async function loadPageHTML(path)
{
    if (path === '/') {
        return;
    }

    try
    {
        const response = await fetch(`/pages/${path}`);

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
    window.addEventListener('popstate', () => {
        // console.log("POPSTATE");
        let url = window.location.hash.replaceAll('-', ' ').replace('#/', '');

        if (!url.endsWith('.html')) {
            url += '.html'
        }

        loadPageToElement(url, 'page-container');
    });
    
    window.addEventListener('hashchange', () => {
        // console.log("HASH CHANGE")
        const hash = window.location.hash;
        // console.log(hash)
    });

    window.addEventListener('load', () => {
        // console.log("LOAD");
        let url = window.location.hash.replaceAll('-', ' ').replace('#/', '');
        
        document.title = window.location.hash.split('/').pop() + ' | Kaavakirja';


        if (!url.endsWith('.html')) {
            url += '.html'
        }

        loadPageToElement(url, 'page-container');
    });
}

export { loadPageToElement, initPageLoading };