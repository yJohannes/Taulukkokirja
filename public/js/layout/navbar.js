import { addToolTip } from "../components/common/tooltip.js";
import { toggleEditor } from "./editor.js";
import { updateBookmarks } from "../components/bookmarks/index.js";

export function initNavbar() {
    const $sidebar1 = document.getElementById('sidebar-1');
    const $sidebar2 = document.getElementById('sidebar-2');
    const $sidebarToggle = document.getElementById('nav-sidebar-toggle');
    const $editor = document.getElementById('nav-latex-editor');
    const $history = document.getElementById('nav-history');
    const $bookmarks = document.getElementById('nav-bookmarks');
    const $darkMode = document.getElementById('nav-dark-mode');
    const $settings = document.getElementById('nav-settings');

    $sidebarToggle.addEventListener('click', () => {
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
        $history,
        $bookmarks,
        $editor,
        $darkMode,
        $settings,
        $sidebarToggle,
    ];

    navs.forEach($nav => {
        addToolTip($nav, 'right');
    });


    $darkMode.addEventListener('toggle-change', (e) => {
        const toggled = e.detail.toggled;
        document.documentElement.classList.toggle('light', !toggled);
        document.documentElement.classList.toggle('dark', toggled);
    });
}