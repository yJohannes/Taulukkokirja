import { loadExplorerToElement } from './explorer.js';
import { initPageLoading } from './pages.js';
import { initSidebar } from './sidebar.js';
import { initNavbar } from './navbar.js';
import { initRipple } from './ripple.js';

document.addEventListener('DOMContentLoaded', async () => {
    initPageLoading();
    initNavbar();
    initSidebar();

    await loadExplorerToElement(document.getElementById('explorer-container'));
    await initRipple();
});
