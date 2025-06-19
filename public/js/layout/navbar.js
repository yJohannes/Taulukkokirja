import { addToolTip } from "../components/common/tooltip.js";
import { showWorkspace, hideWorkspace, isWorkspaceOpen } from "./workspace.js";
import { updateBookmarks } from "../components/bookmarks/bookmarks.js";
import { utils } from "../common/utils.js";
import { Editor } from "../rich-text-editor/index.js";

export const Navbar = {
    init,
}

function init() {
    const sidebar1 = document.getElementById('sidebar-1');
    const sidebar2 = document.getElementById('sidebar-2');
    const sidebarToggle = document.getElementById('nav-sidebar-toggle');
    const editor = document.getElementById('nav-latex-editor');
    const geogebra = document.getElementById('nav-geogebra');
    const history = document.getElementById('nav-history');
    const bookmarks = document.getElementById('nav-bookmarks');
    const darkMode = document.getElementById('nav-dark-mode');
    const settings = document.getElementById('nav-settings');

    // Sidebar toggle just ensures sidebar2 is hidden (sidebar.js handles actual toggling)
    sidebarToggle.addEventListener('click', () => {
        updateBookmarks();
        sidebar2.classList.remove('show');
    });
    bookmarks.addEventListener('click', () => {
        updateBookmarks();
        sidebar1.classList.remove('show');
        sidebar2.classList.toggle('show');
    });
    
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
