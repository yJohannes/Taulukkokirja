import { loadExplorerToElement } from './explorer.js';


loadExplorerToElement('explorer-tabs');

// Navbar
let elements = [];

elements.push(document.getElementById('latex-editor'));
elements.push(document.getElementById('bookmarks'));
elements.push(document.getElementById('settings'));
elements.push(document.getElementById('sidebar-toggle'));

const params = {
    delay: { show: 500, hide: 200 },
    animation: true,
    trigger: 'hover',  // No persisting tooltips
}

elements.forEach(element => {
    element.setAttribute('data-toggle', 'tooltip');
    element.setAttribute('data-placement', 'bottom');
    $(element).tooltip(params);
});


// Sidebar collapse on mobile
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});