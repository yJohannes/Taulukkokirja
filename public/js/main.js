import { SplitGrid } from './layout/split-grid.js';
import { Pages } from './pages/index.js';
import { Sidebar } from './layout/sidebar.js';
import { Navbar } from './layout/navbar.js';
import * as explorer from './components/explorer/index.js'
import { Editor } from './rich-text-editor/index.js'
import { Bookmarks } from './components/bookmarks/bookmarks.js';
import { Search } from './components/search/search.js';

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
    SplitGrid.init();
    Navbar.init();
    Sidebar.init();
    Pages.loading.init();
    explorer.initSearchToInput(document.getElementById('explorer-search'))
    Bookmarks.updateBookmarks();

    await explorer.loadExplorerToElement(document.getElementById('explorer-nav-container'));
    explorer.loadExplorerSave();

    Editor.init();
    await Search.init();
});