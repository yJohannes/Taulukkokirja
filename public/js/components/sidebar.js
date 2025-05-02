


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

    const resizer = document.getElementById("main-splitter");
    const contentWrapper = document.getElementById("content-wrapper");

    let isResizing = false;
    
    resizer.addEventListener("mousedown", (e) => {
        isResizing = true;
        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", () => isResizing = false);
    });
    
    function resize(e) {
        if (!isResizing) return;
        const clickX = e.clientX;
        // Prevent jitter with min
        const diff = Math.min(0, clickX - resizer.getBoundingClientRect().left); 

        const width = Math.min(Math.max(250, clickX + diff), 500)
        contentWrapper.style.gridTemplateColumns = `${width}px 5px minmax(0, 1fr)`;
    }

    if (localStorage.getItem('sidebar-visibility') === 'show') {
        sidebar.classList.add('show');
    }
}

export {
    showSidebar,
    initSidebar
};