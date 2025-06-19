import { StorageHelper } from '../storage/index.js';
import * as explorer from '../explorer/index.js';
import { formatting } from '../../pages/formatting.js';
import { Tab } from '../../../components/tab/tab.js';

export const Bookmarks = {
    createBookmarkButton,
    addBookmarkToHeader,
    updateBookmarks
}

function createTabsFromList(pathsList, container, deleteTargetListName=null) {
    container.innerHTML = '';

    pathsList.forEach(path => {
        const name = formatting.formatPathToLabel(path);
        const tab = Tab.createTab(name, path);
        tab.classList.add('p-2');

       if (deleteTargetListName) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn icon-button rounded-circle ripple  ripple-dark ripple-centered hover-glow';

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevents event from reaching <a>
                e.preventDefault();
                StorageHelper.removeFromStorageList(deleteTargetListName, path);
                updateBookmarks();
            });

            const x = document.createElement('i');
            x.className = 'bi bi-trash3';

            deleteBtn.appendChild(x);
            tab.appendChild(deleteBtn);
        }

        tab.addEventListener('click', (e) => {
            explorer.openPath(path);
            tab.scrollIntoView({ behavior: 'auto', block: 'center' });

            updateBookmarks();
        });

        container.appendChild(tab);
    });
}

export function updateBookmarks() {
    const bookmarksContainer = document.getElementById('bookmark-container');
    const recentsContainer = document.getElementById('recently-viewed-container');

    const bookmarks = StorageHelper.getFromStorageList('bookmarks');
    const recents = StorageHelper.getFromStorageList('recently-viewed');
    
    createTabsFromList(bookmarks, bookmarksContainer, 'bookmarks');
    createTabsFromList(recents, recentsContainer);
}

export function addBookmarkToHeader(header, path, { justify = 'space-between', align = 'center' } = {}) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = justify;
    wrapper.style.alignItems = align;
    header.parentNode.insertBefore(wrapper, header);
    wrapper.appendChild(header);

    const button = createBookmarkButton(path);
    wrapper.appendChild(button);
    return wrapper;
}

export function createBookmarkButton(path) {
    const button = document.createElement('button');
    button.classList.add('btn', 'icon-button', 'rounded-circle', 'ripple', 'ripple-dark', 'ripple-centered', 'hover-glow');
    
    const headerWrapper = document.createElement('h1');
    headerWrapper.style.margin = '0';
    headerWrapper.style.color = 'inherit';

    const icon = document.createElement('i');
    headerWrapper.appendChild(icon);
    button.appendChild(headerWrapper);
    button.addEventListener('click', () => {
        if (icon.classList.toggle('bi-bookmark')) {
            StorageHelper.removeFromStorageList('bookmarks', path)
        }
        
        if (icon.classList.toggle('bi-bookmark-fill')) {
            StorageHelper.addToStorageList('bookmarks', path, true)
        }

        updateBookmarks();
    });

    const bookmarks = StorageHelper.getFromStorageList('bookmarks');
    
    if (bookmarks.includes(path)) {
        icon.classList.add('bi', 'bi-bookmark-fill');
    } else {
        icon.classList.add('bi', 'bi-bookmark');
    }

    return button;
}