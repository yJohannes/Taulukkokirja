import { addToolTip } from "../components/common/tooltip.js";
import { toggleEditor } from "./editor.js";
import { updateBookmarks } from "../components/bookmarks/index.js";

export function initNavbar() {
    const $sidebar1Toggle = document.getElementById('sidebar-1-toggle');
    const $sidebar1 = document.getElementById('sidebar-1');
    const $sidebar2 = document.getElementById('sidebar-2');
    const $editor = document.getElementById('latex-editor');
    const $bookmarks = document.getElementById('bookmarks');
    const $settings = document.getElementById('settings');

    $sidebar1Toggle.addEventListener('click', () => {
        updateBookmarks();
        
        $sidebar2.classList.remove('show');
        // sidebar.js handles the toggling logic
    });

    
    $bookmarks.addEventListener('click', () => {
        updateBookmarks();
        
        $sidebar1.classList.remove('show');
        $sidebar2.classList.toggle('show');
    });
    
    $editor.addEventListener('click', () => {
        toggleEditor();
    })

    let navs = [
        $editor,
        $bookmarks,
        $settings,
        $sidebar1Toggle,
    ];

    navs.forEach($nav => {
        addToolTip($nav, 'bottom');
    });


    document.getElementById('dark-mode').addEventListener('toggle-change', (e) => {
        const toggled = e.detail.toggled;
        document.documentElement.classList.toggle('light', !toggled);
        document.documentElement.classList.toggle('dark', toggled);
    });
}