import { initRipple } from './ripple.js';
import { initLatex } from './latex.js';
import { initTableHighlights } from './tables.js';
import { loadExplorerToElement } from './explorer.js';
import { loadPageToElement } from './pages.js';
import { showPopup } from './popup.js';


loadExplorerToElement('explorer-tabs');

// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const toggleSidebar = document.getElementById('sidebar-toggle');

toggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});

