import { addToolTip } from "../components/common/tooltip.js";
import { showWorkspace, hideWorkspace, isWorkspaceOpen } from "./workspace.js";
import { updateBookmarks } from "../components/bookmarks/bookmarks.js";
import { elementUtils } from "../utils/element-utils.js";
import { SplitGrid } from "./split-grid.js";

export const Navbar = {
    init,
}

function init() {    
    const sidebar1 = document.getElementById('sidebar-left');
    const sidebar2 = document.getElementById('sidebar-right');
    
    const sidebarToggle = document.getElementById('nav-sidebar-toggle');
    const history = document.getElementById('nav-history');
    const bookmarks = document.getElementById('nav-bookmarks');
    const editor = document.getElementById('nav-latex-editor');
    const rightSidebar = document.getElementById('nav-toggle-right-sidebar');
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
        if (elementUtils.isElementVisible(historyRoot) || elementUtils.isElementVisible(bookmarkRoot)) {
            sidebar2.classList.add('show');
            sidebar1.classList.remove('show');

            window.gridManager.setCol(4, true);
            window.gridManager.setCol(5, true);
            SplitGrid.saveGridState();
        } else {
            sidebar2.classList.remove('show');

            window.gridManager.setCol(4, false);
            window.gridManager.setCol(5, false);
            SplitGrid.saveGridState();
        }
    }

    history.addEventListener('click', () => {
       elementUtils.toggleVisibility(historyRoot);
        updateSidebarVisibility();
        updateBookmarks();
    });

    bookmarks.addEventListener('click', () => {
       elementUtils.toggleVisibility(bookmarkRoot);
        updateSidebarVisibility();
        updateBookmarks();
    });
    
    // rightSidebar.addEventListener('click', () => {
    //     toggleGridColumn(SplitGrid.ref, 4, !elementUtils.isElementVisible(sidebar2));
    // });

    const geogebraRoot = document.getElementById('geogebra-iframe-root');
    const editorRoot = document.getElementById('rich-text-editor-root');

    editor.addEventListener('click', () => {
        if (!isWorkspaceOpen()) {
            showWorkspace();
        } else if (elementUtils.isElementVisible(editorRoot)) {
            return hideWorkspace();
        }
        
        if (elementUtils.isElementVisible(geogebraRoot)) {
            elementUtils.showElement(false, geogebraRoot)
            elementUtils.showElement(true, editorRoot);
        }

        localStorage.setItem('workspace-tool', 'editor');
    });

    geogebra.addEventListener('click', () => {
        if (!isWorkspaceOpen()) {
            showWorkspace();
        } else if (elementUtils.isElementVisible(geogebraRoot))
            return hideWorkspace();

        if (elementUtils.isElementVisible(editorRoot)) {
           elementUtils.showElement(false, editorRoot)
           elementUtils.showElement(true, geogebraRoot);
        }

        localStorage.setItem('workspace-tool', 'geogebra');
    });

    const tool = localStorage.getItem('workspace-tool');
    const toolIsEditor = tool === 'editor';

    elementUtils.showElement(toolIsEditor, editorRoot);
    elementUtils.showElement(!toolIsEditor, geogebraRoot);

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

    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        darkMode.toggled = true;
    }

    // Handle dark mode toggle
    darkMode.addEventListener('toggle-change', (e) => {
        const { toggled } = e.detail;
        document.documentElement.classList.toggle('light', !toggled);
        document.documentElement.classList.toggle('dark', toggled);

        const theme = toggled ? 'dark' : 'light';
        localStorage.setItem('theme', theme)
    });
}
