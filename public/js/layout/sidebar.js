import { StorageHelper } from "../components/storage/index.js";
import { Pages } from "../pages/index.js";
import { FileExplorer } from "../components/file_explorer/file-explorer.js";
import { addToolTip } from "../components/common/tooltip.js";

export const Sidebar = {
    init,
    showSidebar,
}

function showSidebar(isVisible, sidebarId) {
    const sidebar = document.getElementById(sidebarId);

    if (isVisible) {
        sidebar.classList.add('show');
        StorageHelper.addToStorageList('show', sidebarId);
    } else {
        sidebar.classList.remove('show');
        StorageHelper.removeFromStorageList('show', sidebarId);
    }
}

async function init() {
    const leftSidebar = document.getElementById('sidebar-left');
    
    // await explorer.loadExplorerToElement(document.getElementById('explorer-nav-container'));
    const fe = new FileExplorer((await Pages.loading.fetchPageStructure()), leftSidebar, 'file-explorer-pages');
    
    document.addEventListener("keydown", (event) => {
        if (event.altKey && event.key === "s") {
            event.preventDefault();
            fe.searchBar.focus();
        }
    });

    for (let button of [fe.btnExpand, fe.btnCollapse, fe.btnAutoCollapse]) {
        addToolTip(button, 'bottom');
    }

    document.addEventListener("keydown", function(event) {
        if (event.altKey && event.key === "1") {
            event.preventDefault();
            fe.btnExpand.click();
        }

        if (event.altKey && event.key === "2") {
            event.preventDefault();
            fe.btnCollapse.click();
        }

        if (event.altKey && event.key === "3") {
            event.preventDefault();
            fe.btnAutoCollapse.click();
        }
    });

    // Sidebar collapse on mobile
    const sidebarToggle = document.getElementById('nav-sidebar-toggle');
    
    sidebarToggle.addEventListener('click', () => {
        const show = leftSidebar.classList.toggle('show');
        if (show) {
            StorageHelper.addToStorageList('show-states', 'sidebar-left');
        } else {
            StorageHelper.removeFromStorageList('show-states', 'sidebar-left');

        }
    });
    
    if (StorageHelper.getFromStorageList('show-states').includes('sidebar-left')) {
        leftSidebar.classList.add('show');
    }
}