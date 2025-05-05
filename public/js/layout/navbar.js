import { addRippleToElement } from "../effects/ripple.js"
import { addToolTip } from "../components/tooltip.js"
import { loadPageToElement } from "../components/pages.js"
import { toggleEditor } from "./editor.js"

function initNavbar()
{
    const sidebar2 = document.getElementById('sidebar2')
    const editor = document.getElementById('latex-editor')
    const bookmarks = document.getElementById('bookmarks')

    editor.addEventListener('click', () => {
        toggleEditor()
    })

    bookmarks.addEventListener('click', () => {
        sidebar2.classList.toggle('show')
    });
    
    // loadPageToElement('Kirjanmerkit.html', 'sidebar2-content', false)
    
    let navs = [];
    navs.push(editor);
    navs.push(bookmarks);
    navs.push(document.getElementById('settings'))
    navs.push(document.getElementById('sidebar-1-toggle'))
    navs.forEach(nav => {
        addToolTip(nav, 'bottom')
        addRippleToElement(nav)
    })
}

export { initNavbar };