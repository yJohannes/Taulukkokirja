import { loadExplorerToElement, loadExplorerSave } from './explorer/explorer.js';
import { initPageLoading } from './components/pages.js';
import { initSidebar } from './components/sidebar.js';
import { initNavbar } from './components/navbar.js';
import { initRipple } from './effects/ripple.js';
import { initArrowNavigation } from './components/arrow_navigation.js';

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
