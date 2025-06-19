import { StorageHelper } from "../components/storage/index.js";

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

function initSidebar() {
    // Sidebar collapse on mobile
    const sidebar = document.getElementById('sidebar-1');
    const sidebarToggle = document.getElementById('nav-sidebar-toggle');
    
    sidebarToggle.addEventListener('click', () => {
        const show = sidebar.classList.toggle('show');
        if (show) {
            StorageHelper.addToStorageList('show-states', 'sidebar-1');
        } else {
            StorageHelper.removeFromStorageList('show-states', 'sidebar-1');

        }
    });
    
    if (StorageHelper.getFromStorageList('show-states').includes('sidebar-1')) {
        sidebar.classList.add('show');
    }
}