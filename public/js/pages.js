import { initTableHighlights } from './tables.js';
import { initLatex } from './latex.js';


async function loadPageHTML(path)
{
    try
    {
        // Fetch the content from the server
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
        const url = location.pathname.replaceAll('-', ' ');
        loadPageToElement(url, 'page-container');
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        const url = location.pathname;
        loadPageToElement('pages/'+  url, 'page-container');
    });

    // document.querySelectorAll('a').forEach(link => {
    //     link.addEventListener('click', event => {
    //         event.preventDefault();
    //         const url = event.target.href;
                
    //         // Update the browser's address bar without reloading
    //         history.pushState(null, '', url);
        
    //         // Load new content into the container
    //         loadPageToElement(url, 'page-container');
    //     });
    // });

    
}

export { loadPageToElement, initPageLoading };