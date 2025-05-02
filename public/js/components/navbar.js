import { addRippleToElement } from "../effects/ripple.js";
import { addToolTip } from "./tooltip.js";
import { loadPageToElement } from "./pages.js";

function initNavbar()
{
    const sidebar2 = document.getElementById('sidebar2');
    const bookmarks = document.getElementById('bookmarks');
    
    bookmarks.addEventListener('click', () => {
        sidebar2.classList.toggle('show');
    });
    
    loadPageToElement('Kirjanmerkit.html', 'sidebar2-content', false)
    
    let navs = [];
    navs.push(document.getElementById('latex-editor'));
    navs.push(bookmarks);
    navs.push(document.getElementById('settings'));
    navs.push(document.getElementById('sidebar1-toggle'));
    navs.forEach(nav => {
        addToolTip(nav, 'bottom')
        addRippleToElement(nav);
    });
}

export { initNavbar };