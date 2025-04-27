import { initTableHighlights } from './tables.js';
import { initLatex, initLatexWorkers, initLatexWorkersFast } from './latex.js';


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

    const newUrl = '/#/' + path.replaceAll(' ', '_').replace('.html', '')
    let pageName = path.split('/').pop().replace('.html', '');
    pageName = decodeURIComponent(pageName)

    history.pushState(null, '', newUrl);

    if (pageName) {
        document.title = pageName + ' | Kaavakirja';
    } else {
        document.title = 'Kaavakirja';
    }

    initLatexWorkersFast();
    initTableHighlights();
}

function initPageLoading()
{
    const loadUrl = () => {
        let url = window.location.hash.replaceAll('_', ' ').replace('#/', '');
    
        if (!url || url === '/') {
            fetch('index.html');
            return;
        }
    
        if (!url.endsWith('.html')) {
            url += '.html'
        }
    
        loadPageToElement(url, 'page-container');

        let pageName = url.split('/').pop().replace('.html', '');
        pageName = decodeURIComponent(pageName)

        pageName ? document.title = pageName + ' | Kaavakirja' : document.title = 'Kaavakirja';
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
        console.log(window.location.hash)

        loadUrl();
    });
}

export { loadPageToElement, initPageLoading };