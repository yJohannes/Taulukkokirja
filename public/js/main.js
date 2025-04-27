import { loadExplorerToElement, loadExplorerSave } from './explorer/explorer.js';
import { initPageLoading } from './pages.js';
import { initSidebar } from './sidebar.js';
import { initNavbar } from './navbar.js';
import { initRipple } from './ripple.js';
import { initArrowNavigation } from './arrow_navigation.js';

const ACTIVE = 'active';
const SHOW = 'show';
const ARROW_FLIPPED = 'flipped';

document.addEventListener('DOMContentLoaded', async () => {
    initPageLoading();
    initNavbar();
    initSidebar();

    await loadExplorerToElement(document.getElementById('explorer-container'));
    await initRipple();
    initArrowNavigation();
    loadExplorerSave();
});
