import { loadExplorerToElement, loadExplorerSave } from './components/explorer/explorer.js';
import { initPageLoading } from './components/pages.js';
import { initSidebar } from './components/sidebar.js';
import { initNavbar } from './components/navbar.js';
import { initRipple } from './effects/ripple.js';
import { loadSettings } from './components/settings.js';

const ACTIVE = 'active';
const SHOW = 'show';
const ARROW_FLIPPED = 'flipped';

document.addEventListener('DOMContentLoaded', async () => {
    initPageLoading();
    initNavbar();
    initSidebar();

    await loadExplorerToElement(document.getElementById('explorer-container'));
    loadExplorerSave();

    initRipple();

    loadSettings();
});
