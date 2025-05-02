

function showSidebar(boolShow)
{
    const sidebar = document.getElementById('sidebar1');

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
    const sidebar = document.getElementById('sidebar1');
    const sidebarToggle = document.getElementById('sidebar1-toggle');
    
    sidebarToggle.addEventListener('click', () => {
        const show = sidebar.classList.toggle('show');
        if (show) {
            localStorage.setItem('sidebar-visibility', 'show');
        } else {
            localStorage.removeItem('sidebar-visibility');
        }
    });

    const splitters = document.querySelectorAll(".splitter");
    const contentWrapper = document.getElementById("content-wrapper");

    let isResizing = false;
    const widths = []
    
    splitters.forEach(splitter => {
        widths.push("325px");
    
        splitter.addEventListener("mousedown", (e) => {
            isResizing = true;
            const initialX = e.clientX; // Capture initial position of the mouse
            const initialWidth1 = parseInt(widths[0], 10); // Initial width of the first column
            const initialWidth2 = parseInt(widths[1], 10); // Initial width of the second column
    
            // Listen to mouse move and mouse up events
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
    
            function onMouseMove(e) {
                if (!isResizing) return;
    
                // Calculate the change in mouse position
                const deltaX = e.clientX - initialX;
    
                // Calculate new width, ensuring it's within the min/max limits
                const width1 = Math.min(Math.max(250, initialWidth1 + deltaX), 500);
                const width2 = Math.min(Math.max(150, initialWidth2 - deltaX), 350);
    
                console.log(window.getComputedStyle(contentWrapper).gridTemplateColumns);
    
                if (splitter.id === "splitter1") {
                    contentWrapper.style.gridTemplateColumns = `${width1}px 5px minmax(0, 1fr) 5px ${widths[1]}`;
                    widths[0] = `${width1}px`; // Update the first column width
                } else if (splitter.id === "splitter2") {
                    contentWrapper.style.gridTemplateColumns = `${widths[0]} 5px minmax(0, 1fr) 5px ${width2}px`;
                    widths[1] = `${width2}px`; // Update the second column width
                }
            }
    
            function onMouseUp() {
                isResizing = false;
                // Remove event listeners once the user releases the mouse
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }
        });
    });
    
    if (localStorage.getItem('sidebar-visibility') === 'show') {
        sidebar.classList.add('show');
    }
}

export {
    showSidebar,
    initSidebar
};