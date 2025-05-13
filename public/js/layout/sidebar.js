import * as storage from '../components/storage/index.js';

function showSidebar(boolShow)
{
    const sidebar = document.getElementById('sidebar-1');

    if (boolShow) {
        sidebar.classList.add('show');
        storage.addToStorageList('show', 'sidebar-1');
    } else {
        sidebar.classList.remove('show');
        storage.removeFromStorageList('show', 'sidebar-1');
    }
}

function initSidebar()
{
    // Sidebar collapse on mobile
    const sidebar = document.getElementById('sidebar-1');
    const sidebarToggle = document.getElementById('sidebar-1-toggle');
    
    sidebarToggle.addEventListener('click', () => {
        const show = sidebar.classList.toggle('show');
        if (show) {
            storage.addToStorageList('show-states', 'sidebar-1');
        } else {
            storage.removeFromStorageList('show-states', 'sidebar-1');

        }
    });
    
    if (storage.getFromStorageList('show-states').includes('sidebar-1')) {
        sidebar.classList.add('show');
    }
}

export {
    showSidebar,
    initSidebar
};