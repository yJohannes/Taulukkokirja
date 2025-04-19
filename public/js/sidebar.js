
function showSidebar(boolShow)
{
    const sidebar = document.getElementById('sidebar');

    if (boolShow) {
        sidebar.classList.add('show');
        localStorage.setItem('sidebar-visibility', 'show');
    } else {
        sidebar.classList.remove('show');
        localStorage.removeItem('sidebar-visibility');
    }
}

function initSidebar()
{
    // Sidebar collapse on mobile
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    
    sidebarToggle.addEventListener('click', () => {
        const show = sidebar.classList.toggle('show');
        if (show) {
            localStorage.setItem('sidebar-visibility', 'show');
        } else {
            localStorage.removeItem('sidebar-visibility');
        }
    });

    if (localStorage.getItem('sidebar-visibility') === 'show') {
        sidebar.classList.add('show');
    }
}

export {
    showSidebar,
    initSidebar
};