import { StorageHelper } from '../storage/index.js';
import { Tab } from '../../../components/tab/tab.js';
import { FlipArrow } from '../../../components/flip_arrow/flip-arrow.js';

export function handleTabClick(fileExplorer, tab, isDropdown, parentElement) {
    const activeTabs = parentElement.querySelectorAll(`.${'active'}`);

    // Handle basic tabs
    if (!isDropdown) {
        // Clicked the current tab
        if (tab.classList.contains('active')) {
            return;
        }
        
        activeTabs.forEach(t => {
            t.classList.remove('active');
            if (!isDropdown) {
                StorageHelper.removeFromStorageList('active-states', t.getAttribute('data-path'));
            }
        });

        StorageHelper.addToStorageList('active-states', tab.getAttribute('data-path'));
        tab.classList.add('active');
        return;
    }

    // Handle collapsible tabs
    const nestedDropdown = Tab.getTabDropdown(tab);
    activeTabs.forEach(t => t.classList.remove('active'));

    // If closing a dropdown, shift focus up a level
    if (nestedDropdown.classList.contains('show')) {
        nestedDropdown.classList.remove('show');
        StorageHelper.removeFromStorageList('show-states', tab.getAttribute('data-path'));

        const parentDropdown = tab.parentElement.parentElement;
        const parentTab = parentDropdown.parentElement.querySelector('button');

        // Dismiss highest level dropdown
        if (!(parentDropdown.parentElement.id === 'explorer-nav-container')) {
            parentTab.classList.add('active');
            
            StorageHelper.addToStorageList('show-states', parentTab.getAttribute('data-path'));
        }

    } else {
        const autoCollapse = document.getElementById('explorer-auto-collapse')
        const autoCollapseOn = autoCollapse.classList.contains('active');
        
        if (autoCollapseOn) {
            // collapseExplorer();
            // openPath(document, tab.getAttribute('data-path'));
            const parentDropdown = tab.parentElement.parentElement;
            const openDropdown = parentDropdown.querySelectorAll(`.${'show'}`);

            openDropdown.forEach(dropdown => {
                const tab = dropdown.parentElement.querySelector('button');
                const arrow = tab.querySelector('svg');
                
                FlipArrow.setArrowFlip(false, arrow);
                dropdown.classList.remove('show');
                StorageHelper.removeFromStorageList('show-states', tab.getAttribute('data-path'))
            });
        }

        // Set tab as 'active' and show contents
        tab.classList.add('active');
        nestedDropdown.classList.add('show');

        StorageHelper.addToStorageList('show-states', tab.getAttribute('data-path'));
    }
}

export function createTreeView(parent, treeData, rootPath = '') {
    const rootList = Tab.createTabList(false);

    const stack = [
        {
            data: treeData,
            path: rootPath,
            parentList: rootList
        }
    ];

    const rootDepth = rootPath.split('/').filter(Boolean).length;

    while (stack.length > 0) {
        const { data, path, parentList } = stack.pop();

        for (const [entryName, entryValue] of Object.entries(data)) {
            const currentPath = path ? `${path}/${entryName}` : entryName;
            const pageName = entryName.replace('.html', '');
            const level = currentPath.split('/').filter(Boolean).length - rootDepth - 1;
            const isFolder = typeof entryValue === 'object' && entryValue !== null;

            const item = Tab.createTabListItem();
            const tab = Tab.createTab(pageName, currentPath, isFolder, level);
            tab.addEventListener('click', () => handleTabClick(parent, tab, isFolder));

            if (isFolder && level === 0) tab.style.fontWeight = 'bold';

            item.appendChild(tab);
            parentList.appendChild(item);

            if (isFolder) {
                const childList = Tab.createTabList(true);
                item.appendChild(childList);

                // Push next level onto the stack
                stack.push({
                    data: entryValue,
                    path: currentPath,
                    parentList: childList
                });
            }
        }
    }

    return rootList;
}


// Recursive function to generate the tab list with collapsibility
// export function createTreeView(parent, treeData, rootPath='', isRootCollapsible=false, _recurseRootPath='') {
//     if (!_recurseRootPath) _recurseRootPath = rootPath;

//     const list = Tab.createTabList(isRootCollapsible);

//     for (const [entryName, entryValue] of Object.entries(treeData)) {
//         const currentPath = _recurseRootPath ? `${_recurseRootPath}/${entryName}`: entryName;
//         const pageName = entryName.replace('.html', '');
//         const level = currentPath.split('/').length - rootPath.split('/').length - 1; 

//         const item = Tab.createTabListItem();
//         const isFolder = typeof entryValue === 'object' && entryValue !== null;
        
//         const tab = Tab.createTab(pageName, currentPath, isFolder, level);
//         tab.addEventListener('click', () => {
//             handleTabClick(tab, isFolder, parent);
//             updateBookmarks();
//         });

//         if (isFolder && level === 0) tab.style.fontWeight = 'bold';

//         item.appendChild(tab);

//         if (isFolder)
//             item.appendChild(createTreeView(parent, entryValue, rootPath, true, currentPath));

//         list.appendChild(item);
//     }

//     return list;
// }