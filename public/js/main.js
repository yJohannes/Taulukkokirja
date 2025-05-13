import { setRealVH } from './layout/grid.js';
import { initSplitGrid } from './components/split-grid.js';
import { initPageLoading } from './pages/index.js';
import { initSidebar } from './layout/sidebar.js';
import { initNavbar } from './layout/navbar.js';
import { loadSettings } from './components/settings.js';
import * as explorer from './components/explorer/index.js'
import * as editor from './rich-text-editor/index.js'
import * as bookmarks from './components/bookmarks/index.js';
import * as search from './components/search/index.js';

window.addEventListener('resize', setFullHeight);
window.addEventListener('load', setFullHeight);

document.addEventListener('DOMContentLoaded', async () => {
    initSplitGrid();
    initPageLoading();
    initNavbar();
    initSidebar();
    explorer.initSearchToInput(document.getElementById('explorer-search'))
    bookmarks.updateBookmarks();

    await explorer.loadExplorerToElement(document.getElementById('explorer-container'));
    explorer.loadExplorerSave();
    loadSettings();

    editor.init();

    await search.initSearch();
});