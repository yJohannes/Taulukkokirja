let ref;

export const SplitGrid = {
    ref,
    init,
    saveGridState,
}

function init() {
    SplitGrid.ref = document.getElementById('content-grid');
    
    const data = JSON.parse(localStorage.getItem('grid-data'));
    if (data) {
        SplitGrid.ref.style.gridTemplateColumns = data.columns;
        SplitGrid.ref.style.gridTemplateRows = data.rows;
    }    

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

        // hard-hide provides an optimization during resizing.
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
    localStorage.setItem('grid-data', JSON.stringify({
        columns: SplitGrid.ref.style.gridTemplateColumns,
        rows: SplitGrid.ref.style.gridTemplateRows
    }));
}