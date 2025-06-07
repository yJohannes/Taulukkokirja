import * as storage from '../storage/index.js';
import * as explorer from '../explorer/index.js';

function createTabsFromList(pathsList, $container, deleteTargetListName=null) {
    $container.innerHTML = '';

    pathsList.forEach(path => {
        const name = explorer.formatPathLabel(path);

        const $tab = explorer.createTab(name, 0, false, path);
        $tab.style.setProperty('padding', '0.5rem', 'important');
        $tab.style.setProperty('padding-left', '0.75rem', 'important');

       if (deleteTargetListName) {
            const $delete = document.createElement('button');
            $delete.classList.add('btn', 'rounded-circle', 'ripple', 'ripple-dark', 'ripple-centered', 'hover-glow')
            $delete.classList.add('button-with-icon');
            $delete.style.fontSize = '1rem';

            $delete.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevents event from reaching <a>
                e.preventDefault();
                storage.removeFromStorageList(deleteTargetListName, path);
                updateBookmarks();
            });

            const $x = document.createElement('i');
            $x.classList.add('bi', 'bi-trash3-fill');
            $x.style.fontSize = '110%'

            $delete.appendChild($x);
            $tab.appendChild($delete);
        }

        $tab.addEventListener('click', (e) => {
            explorer.openPath(path);
            $tab.scrollIntoView({
                behavior: 'auto',
                block: 'center'
            });

            updateBookmarks();
        });

        $container.appendChild($tab);
    });
}

export function updateBookmarks() {
    const $bookmarksContainer = document.getElementById('bookmark-container');
    const $recentsContainer = document.getElementById('recently-viewed-container');

    const bookmarks = storage.getFromStorageList('bookmarks');
    const recents = storage.getFromStorageList('recently-viewed');
    
    
    createTabsFromList(bookmarks, $bookmarksContainer, 'bookmarks');
    createTabsFromList(recents, $recentsContainer);
}