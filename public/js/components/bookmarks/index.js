import * as storage from '../storage/index.js';
import * as explorer from '../explorer/index.js';
import { formatting } from '../../pages/formatting.js';
import { Tab } from '../../../components/tab/tab.js';

function createTabsFromList(pathsList, container, deleteTargetListName=null) {
    container.innerHTML = '';

    pathsList.forEach(path => {
        const name = formatting.formatPathToLabel(path);

        const tab = Tab.createTab(name, path);
        tab.style.setProperty('padding', '0.5rem', 'important');
        tab.style.setProperty('padding-left', '0.75rem', 'important');

       if (deleteTargetListName) {
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'rounded-circle', 'ripple', 'ripple-dark', 'ripple-centered', 'hover-glow')
            deleteBtn.classList.add('icon-button');
            deleteBtn.style.fontSize = '1rem';

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevents event from reaching <a>
                e.preventDefault();
                storage.removeFromStorageList(deleteTargetListName, path);
                updateBookmarks();
            });

            const x = document.createElement('i');
            x.classList.add('bi', 'bi-trash3');

            deleteBtn.appendChild(x);
            tab.appendChild(deleteBtn);
        }

        tab.addEventListener('click', (e) => {
            explorer.openPath(path);
            tab.scrollIntoView({
                behavior: 'auto',
                block: 'center'
            });

            updateBookmarks();
        });

        container.appendChild(tab);
    });
}

export function updateBookmarks() {
    const bookmarksContainer = document.getElementById('bookmark-container');
    const recentsContainer = document.getElementById('recently-viewed-container');

    const bookmarks = storage.getFromStorageList('bookmarks');
    const recents = storage.getFromStorageList('recently-viewed');
    
    createTabsFromList(bookmarks, bookmarksContainer, 'bookmarks');
    createTabsFromList(recents, recentsContainer);
}

export function addBookmarkToHeader(header, {justify = 'space-between', align = 'center'} = {}) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = justify;
    wrapper.style.alignItems = align;
    header.parentNode.insertBefore(wrapper, header);
    wrapper.appendChild(header);

    const button = createBookmarkButton();
    wrapper.appendChild(button);
    return wrapper;
}

export function createBookmarkButton(pagePath) {
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
            storage.removeFromStorageList('bookmarks', pagePath)
        }
        
        if (icon.classList.toggle('bi-bookmark-fill')) {
            storage.addToStorageList('bookmarks', pagePath, true)
        }

        updateBookmarks();
    });

    const bookmarks = storage.getFromStorageList('bookmarks');
    
    if (bookmarks.includes(pagePath)) {
        icon.classList.add('bi', 'bi-bookmark-fill');
    } else {
        icon.classList.add('bi', 'bi-bookmark');
    }

    return button;
}