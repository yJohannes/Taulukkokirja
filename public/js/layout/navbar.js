import { addRippleToElement } from "../effects/ripple.js"
import { addToolTip } from "../components/common/tooltip.js"
import { loadPageToElement } from "../pages/index.js"
import { toggleEditor } from "./editor.js"
import { updateBookmarks } from "../components/bookmarks/index.js"

function initNavbar()
{
    const sidebar2 = document.getElementById('sidebar-2')
    const editor = document.getElementById('latex-editor')
    const bookmarks = document.getElementById('bookmarks')

    editor.addEventListener('click', () => {
        toggleEditor()
    })

    bookmarks.addEventListener('click', () => {
        updateBookmarks();
        
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