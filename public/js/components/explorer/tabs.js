import { StorageHelper } from '../storage/index.js';
import { Sidebar }  from '../../layout/sidebar.js';
import { updateBookmarks } from '../bookmarks/bookmarks.js';
import { Tab } from '../../../components/tab/tab.js';
import { FlipArrow } from '../../../components/flip_arrow/flip-arrow.js';
import { FileExplorerUtils } from './utils.js';


export function handleTabClick(tab, isDropdown, parentElement) {
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

        // If tab is clicked on small screen hide sidebar
        Sidebar.showSidebar(false, 'sidebar-1');
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
            // openPath(tab.getAttribute('data-path'));
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

// Recursive function to generate the tab list with collapsibility
export function generateTabs(data, parentElement, rootPath='pages', isRootCollapsible=false) {
    const list = Tab.createTabList(isRootCollapsible);

    data = data.pages || data; // Support both top-level and nested calls
    for (let key in data) {
        const pageName = key.replace('.html', '');
        const currentPath = rootPath ? rootPath + '/' + key : key;
        const level = currentPath.split('/').length - 1 - 1; // sub 1 again because of pages as root 

        const item = Tab.createTabListItem();

        let tab; 
        if (typeof data[key] === 'object' && data[key] !== null) {
            tab = Tab.createTab(pageName, currentPath, true, level);    // Dropdown tab
            tab.addEventListener('click', () => handleTabClick(tab, true, parentElement));
            
            if (level === 0)
                tab.style.fontWeight = 'bold';
        } else {
            tab = Tab.createTab(pageName, currentPath, false, level);   // Normal tab
            tab.addEventListener('click', () => handleTabClick(tab, false, parentElement));
        }
        
        tab.addEventListener('click', () => updateBookmarks());
        item.appendChild(tab);

        // If the value is an object (i.e., nested dropdown), recursively create a nested dropdown
        if (typeof data[key] === 'object' && data[key] !== null) {
            const nestedDropdown = generateTabs(data[key], parentElement, currentPath, true);
            item.appendChild(nestedDropdown);
        }

        list.appendChild(item);
    }

    return list;
}
