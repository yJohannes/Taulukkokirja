import { addToolTip } from "../components/common/tooltip.js";
import { showWorkspace, hideWorkspace, isWorkspaceOpen } from "./workspace.js";
import { updateBookmarks } from "../components/bookmarks/bookmarks.js";
import { utils } from "../common/utils.js";
import { Editor } from "../rich-text-editor/index.js";

import { SplitGrid } from "./split-grid.js";
import { toggleGridColumn } from "./workspace.js";

export const Navbar = {
    init,
}

function init() {
    const sidebar1 = document.getElementById('sidebar-1');
    const sidebar2 = document.getElementById('sidebar-2');
    
    const sidebarToggle = document.getElementById('nav-sidebar-toggle');
    const history = document.getElementById('nav-history');
    const bookmarks = document.getElementById('nav-bookmarks');
    const editor = document.getElementById('nav-latex-editor');
    // const rightSidebar = document.getElementById('nav-toggle-right-sidebar');
    const geogebra = document.getElementById('nav-geogebra');
    const darkMode = document.getElementById('nav-dark-mode');
    const settings = document.getElementById('nav-settings');

    // Sidebar toggle just ensures sidebar2 is hidden (sidebar.js handles actual toggling)
    sidebarToggle.addEventListener('click', () => {
        updateBookmarks();
        sidebar2.classList.remove('show');
    });

    const bookmarkRoot = document.getElementById('bookmarks');
    const historyRoot = document.getElementById('recently-viewed');

    function updateSidebarVisibility() {
        if (utils.isElementVisible(historyRoot) || utils.isElementVisible(bookmarkRoot)) {
            sidebar2.classList.add('show');
            sidebar1.classList.remove('show');
        } else {
            sidebar2.classList.remove('show');
        }
    }

    history.addEventListener('click', () => {
        utils.toggleVisibility(historyRoot);
        updateSidebarVisibility();
        updateBookmarks();
    });

    bookmarks.addEventListener('click', () => {
        utils.toggleVisibility(bookmarkRoot);
        updateSidebarVisibility();
        updateBookmarks();
    });
    
    // rightSidebar.addEventListener('click', () => {
    //     toggleGridColumn(SplitGrid.ref, 4, !utils.isElementVisible(sidebar2));
    // });

    const geogebraRoot = document.getElementById('geogebra-iframe-root');
    const editorRoot = document.getElementById('rich-text-editor-root');

    editor.addEventListener('click', () => {
        if (!isWorkspaceOpen()) {
            showWorkspace();
        } else if (utils.isElementVisible(editorRoot))
            return hideWorkspace();

        
        if (utils.isElementVisible(geogebraRoot)) {
            utils.showElement(false, geogebraRoot)
            utils.showElement(true, editorRoot);
        }
    });

    geogebra.addEventListener('click', () => {
        if (!isWorkspaceOpen()) {
            showWorkspace();
        } else if (utils.isElementVisible(geogebraRoot))
            return hideWorkspace();

        if (utils.isElementVisible(editorRoot)) {
            utils.showElement(false, editorRoot)
            utils.showElement(true, geogebraRoot);
        }
    });

    // Apply tooltips
    [
        history,
        bookmarks,
        editor,
        geogebra,
        darkMode,
        settings,
        sidebarToggle,
    ].forEach(el => addToolTip(el, 'right'));

    // Handle dark mode toggle
    darkMode.addEventListener('toggle-change', (e) => {
        const { toggled } = e.detail;
        document.documentElement.classList.toggle('light', !toggled);
        document.documentElement.classList.toggle('dark', toggled);
    });
}
