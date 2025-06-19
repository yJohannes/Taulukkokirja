import { StorageHelper } from '../storage/index.js';
import { initSearchToInput } from './search.js';
import { generateTabs } from './tab.js';
import { buttons } from './buttons.js';
import { SearchBar } from '../../../components/search_bar/search-bar.js';
import { Tab } from '../../../components/tab/tab.js';
import { FlipArrow } from '../../../components/flip_arrow/flip-arrow.js';
import { Pages } from '../../pages/index.js';


export function loadExplorerSave() {
    const explorer = document.querySelector('#explorer-nav-container');
    const lists = explorer.querySelectorAll('.tab-list');
    
    // Collapse all dropdowns and unflip arrows
    lists.forEach(list => {
        const items = list.querySelectorAll('.tab-list-item');
        items.forEach(item => {
            const tabs = item.querySelectorAll('.tab');
            tabs.forEach((tab) => {
                const path = tab.getAttribute('data-path');
                if (Tab.isDropdownTab(tab)) {
                    if (StorageHelper.getFromStorageList('show-states').includes(path)) {
                        const dropdown = item.querySelector('.tab-list');
                        dropdown?.classList.add('show');
                        
                        FlipArrow.setArrowFlip(true, tab.querySelector(`svg`));
                    }
                }
            });
        });
    });
}

export async function loadExplorerToElement(parentElement)
{    
    const search = document.getElementById('explorer-search');
    SearchBar.makeSearchBar(search);

    initSearchToInput(search)
    
    const structure = await Pages.loading.fetchPageStructure();
    const tabs = generateTabs(structure, parentElement);
    tabs.id = 'explorer-tabs-root';
    parentElement.appendChild(tabs);

    buttons.init();
}