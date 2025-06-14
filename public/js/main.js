import { initSplitGrid } from './components/split-grid.js';
import { initPageLoading } from './pages/index.js';
import { initSidebar } from './layout/sidebar.js';
import { initNavbar } from './layout/navbar.js';
import { loadSettings } from './components/settings.js';
import * as explorer from './components/explorer/index.js'
import * as editor from './rich-text-editor/index.js'
import * as bookmarks from './components/bookmarks/index.js';
import * as search from './components/search/index.js';

import '../components/search_bar/search-bar.js';
import '../components/toggle_button/toggle-button.js';
import '../components/ripple/index.js';
import '../components/table_highlighting/index.js';

function setRealVH() {
    document.documentElement.style.setProperty('--real-vh', `${window.innerHeight * 0.01}px`);
}

function setRealVHMobile() {
    document.documentElement.style.setProperty('--real-vh', `${window.visualViewport.height * 0.01}px`);
}

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setRealVHMobile);
    window.visualViewport.addEventListener('load', setRealVHMobile);
    setRealVHMobile();
} else {
    window.addEventListener('resize', setRealVH);
    window.addEventListener('load', setRealVH);
    setRealVH();
}

document.addEventListener('DOMContentLoaded', async () => {
    initSplitGrid();
    initPageLoading();
    initNavbar();
    initSidebar();
    explorer.initSearchToInput(document.getElementById('explorer-search'))
    bookmarks.updateBookmarks();

    await explorer.loadExplorerToElement(document.getElementById('explorer-nav-container'));
    explorer.loadExplorerSave();
    loadSettings();

    editor.init();
    await search.initSearch();
});