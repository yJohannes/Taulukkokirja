export function initSplitGrid() {
    document.getElementById('content-wrapper').style.gridTemplateColumns = localStorage.getItem('grid-template-columns');
    document.getElementById('content-wrapper').style.gridTemplateRows    = localStorage.getItem('grid-template-rows');

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
            element: document.querySelector('#editor-gutter'),
        }],

        snapOffset: 10,

        // These match min-widths described in stylesheets
        columnMinSizes: {
            0: 250, // Sidebar
            4: 250, // Sidebar 2
        },

        rowMinSizes: {
            2: 0, // Editor 
        },

        onDragStart: () => {
            const $hidden = document.querySelectorAll('.explorer-dropdown:not(.show)');
            $hidden.forEach($element => {
                $element.classList.add('hard-hide');
            })
        },

        onDrag: () => {

        },

        onDragEnd: () => {
            const $hidden = document.querySelectorAll('.explorer-dropdown:not(.show).hard-hide');
            $hidden.forEach($element => {
                $element.classList.remove('hard-hide');
            })

            saveGridState();
        }
    });
}

export function saveGridState() {
    localStorage.setItem('grid-template-columns', document.getElementById('content-wrapper').style.gridTemplateColumns);
    localStorage.setItem('grid-template-rows',    document.getElementById('content-wrapper').style.gridTemplateRows);
}