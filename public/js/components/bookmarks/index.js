import * as storage from '../storage/index.js';
import { loadPageToElement,  } from '../pages.js';
import { sanitizePath } from '../pages.js';
import { addRippleToElement } from '../../effects/ripple.js';

import * as explorer from '../explorer/index.js';



function createTabFromList(pathsList, $container, deleteTargetListName=null) {
    $container.innerHTML = '';

    pathsList.forEach(path => {
        const name = explorer.formatPathLabel(path);

        const $tab = explorer.createTab(name, 0, false, path);
        $tab.style.padding = '8px';
        addRippleToElement($tab);

        /* 
            <button id="explorer-clear-search" class="btn rounded-circle ripple ripple-dark ripple-centered hover-glow" style="display: none;">
                <i class="bi bi-x-lg" style="font-size: 120%;"></i>
            </button>
        */
       if (deleteTargetListName) {
            const $delete = document.createElement('button');
            $delete.classList.add('btn', 'rounded-circle', 'ripple', 'ripple-dark', 'ripple-centered', 'hover-glow')
            $delete.classList.add('button-with-icon');
            addRippleToElement($delete);

            $delete.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevents event from reaching <a>
                e.preventDefault();

                storage.removeFromStorageList(deleteTargetListName, path);
                updateBookmarks();
            });

            const $x = document.createElement('i');
            $x.classList.add('bi', 'bi-trash3-fill');
            $x.style.fontSize = '120%'

            $delete.appendChild($x);
            $tab.appendChild($delete);
        }

        $tab.addEventListener('click', (e) => {
            loadPageToElement(path, 'page-container');

            explorer.openPath(path);
            $tab.scrollIntoView({
                behavior: 'auto',
                block: 'center'
            });

            $tab.addEventListener('click', () => updateBookmarks());
        });

        $container.appendChild($tab);
    });
}

export function updateBookmarks() {
    const $bookmarksContainer = document.getElementById('bookmark-container');
    const $recentsContainer = document.getElementById('recently-viewed-container');

    const bookmarks = storage.getFromStorageList('bookmarks');
    const recents = storage.getFromStorageList('recently-viewed');
    
    // Use the function for both lists
    createTabFromList(bookmarks, $bookmarksContainer, 'bookmarks');
    createTabFromList(recents, $recentsContainer);
}