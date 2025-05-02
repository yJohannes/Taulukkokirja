import { addRippleToElement } from "../effects/ripple.js";
import { addToolTip } from "./tooltip.js";

function initNavbar()
{
    let navs = [];
    navs.push(document.getElementById('latex-editor'));
    navs.push(document.getElementById('bookmarks'));
    navs.push(document.getElementById('settings'));
    navs.push(document.getElementById('sidebar-toggle'));

    navs.forEach(nav => {
        addToolTip(nav, 'bottom')
        addRippleToElement(nav);
    });
}

export { initNavbar };