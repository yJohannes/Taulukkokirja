import { initRealVH } from './utils/viewport.js';
import { GridManager } from './layout/grid-manager.js';
import { SplitGrid } from './layout/split-grid.js';
import { Pages } from './pages/index.js';
import { Sidebar } from './layout/sidebar.js';
import { Navbar } from './layout/navbar.js';
import { Editor } from './rich-text-editor/index.js'
import { Bookmarks } from './components/bookmarks/bookmarks.js';
import { Search } from './components/search/search.js';

import '../components/search_bar/search-bar.js';
import '../components/toggle_button/toggle-button.js';
import '../components/ripple/index.js';
import '../components/table_highlighting/index.js';

document.addEventListener('DOMContentLoaded', async () => {
    window.gridManager = new GridManager(document.getElementById('content-grid'), 'grid-d');
    
    const root = document.documentElement;
    const fontSize = window.getComputedStyle(root).getPropertyValue('--font-size').trim();
    const scale = localStorage.getItem('font-scale');
    document.documentElement.style.fontSize = `calc(${scale} * (${fontSize}))`;
    
    initRealVH();


    SplitGrid.init();

    Navbar.init();
    Sidebar.init();
    Pages.loading.init();
    Bookmarks.updateBookmarks();    

    Editor.init();
    await Search.init();
});