import * as explorer from './components/explorer/index.js'

import { initSplitGrid } from './components/split-grid.js';
import { initPageLoading } from './components/pages.js';
import { initSidebar } from './layout/sidebar.js';
import { initNavbar } from './layout/navbar.js';
import { loadSettings } from './components/settings.js';
import * as editor from './rich-text-editor/index.js'
import * as bookmarks from './components/bookmarks/index.js';
import * as search from './components/search/index.js';
import { loadPageToElement } from './components/pages.js';

document.addEventListener('DOMContentLoaded', async () => {
    // loadPageToElement('Kirjanmerkit.html', 'sidebar-2-content', false)

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