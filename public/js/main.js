import { initRealVH } from './utils/viewport.js';
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

document.addEventListener('DOMContentLoaded', async () => {
    initRealVH();
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