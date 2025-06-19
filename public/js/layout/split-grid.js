let ref;

export const SplitGrid = {
    ref,
    init,
    saveGridState,
}

function init() {
    SplitGrid.ref = document.getElementById('content-grid');
    SplitGrid.ref.style.gridTemplateColumns = localStorage.getItem('grid-template-columns');
    SplitGrid.ref.style.gridTemplateRows    = localStorage.getItem('grid-template-rows');

    Split({
        columnGutters: [{
            track: 1,
            element: document.querySelector('#gutter-col-1'),
        },
        {
            track: 3,
            element: document.querySelector('#gutter-col-2'),
        }],

        rowGutters: [{
            track: 1,
            element: document.querySelector('#main-workspace-splitter'),
        }],

        snapOffset: 10,

        // These match min-widths described in stylesheets
        columnMinSizes: {
            0: 250, // Sidebar
            4: 250, // Sidebar 2
        },

        columnMaxSizes: {
            0: 450,
            4: 450,
        },

        rowMinSizes: {
            2: 0, // Editor 
        },

        onDragStart: () => {
            const hidden = document.querySelectorAll('.tab-dropdown:not(.show)');
            hidden.forEach(element => {
                element.classList.add('hard-hide');
            })
        },

        onDrag: () => {

        },

        onDragEnd: () => {
            const hidden = document.querySelectorAll('.tab-dropdown:not(.show).hard-hide');
            hidden.forEach(element => {
                element.classList.remove('hard-hide');
            })

            saveGridState();
        }
    });
}

function saveGridState() {
    localStorage.setItem('grid-template-columns', SplitGrid.ref.style.gridTemplateColumns);
    localStorage.setItem('grid-template-rows',    SplitGrid.ref.style.gridTemplateRows);
}