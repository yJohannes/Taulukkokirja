import { SearchBar } from '../../../components/search_bar/search-bar.js';
import { Tab } from "../../../components/tab/tab.js";
import { FlipArrow } from '../../../components/flip_arrow/flip-arrow.js';
import { StorageHelper } from "../storage/index.js";
import { initSearchToInput } from './search.js';
import { generateTabs } from './tabs.js';

// import { Pages } from '../../pages/index.js'
// import { addToolTip } from "../common/tooltip.js";
// await Pages.loading.fetchPageStructure();

export class FileExplorer {
    constructor(fileStructure, parent) {
        this.fileStructure = fileStructure;
        this.parent = parent;
        this.init();
    }
    
    async init() {
        this.root = document.createElement('section');
        this.root.setAttribute('aria-label', 'File explorer');
        this.root.classList.add('file-explorer');
        this.root.innerHTML = `
            <div class="sticky-header mb-1">
                <input class="file-explorer__search-bar form-control" placeholder="Hae..." autocomplete="off"></input>
    
                <div class="file-explorer__buttons d-flex justify-content-end mt-2" role="group">
                    <button class="file_explorer__button-expand"
                        class="btn btn-sm ripple ripple-dark ripple-centered hover-glow"
                        title="Laajenna välilehdet (alt + 1)" aria-label="Laajenna välilehdet"
                        style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: 1rem;"
                    >
                        <i class="bi bi-arrows-expand" style="font-size: 120%;"></i>
                    </button>
                    <button class="file_explorer__button-collapse"
                        class="btn btn-sm ripple ripple-dark ripple-centered hover-glow"
                        title="Sulje välilehdet (alt + 2)" aria-label="Sulje välilehdet"
                        style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: 1rem;"
                    >
                        <i class="bi bi-arrows-collapse" style="font-size: 120%;"></i>
                    </button>
                    <button class="file_explorer__button-auto-collapse"
                        class="btn btn-sm ripple ripple-dark ripple-centered hover-glow"
                        title="Automaattinen sulkeminen (alt + 3)" aria-label="Automaattinen sulkeminen"
                        style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: 1rem;"
                    >
                        <i class="bi bi-list-nested" style="font-size: 120%;"></i>
                    </button>
                </div>
            </div>
            <nav class="file-explorer__tree-container rounded w-100"></nav>
            <nav class="file-explorer__search-result-container rounded w-100"></nav>
        `;
    
        this.btnExpand = this.root.querySelector('.file_explorer__button-expand');
        this.btnCollapse = this.root.querySelector('.file_explorer__button-collapse');
        this.btnAutoCollapse = this.root.querySelector('.file_explorer__button-auto-collapse');

        this.searchBar = this.root.querySelector('.file-explorer__search-bar');

        this.treeContainer = this.root.querySelector('.file-explorer__tree-container');
        this.searchResultContainer = this.root.querySelector('.file-explorer__search-result-container');
    
        this._initSearch();
        this._initButtons();
        this._initTree();
        
        this.parent.appendChild(this.root);
    }

    _initSearch() {
        SearchBar.makeSearchBar(searchBar);
        initSearchToInput(searchBar, this.searchResultContainer)
    }

    _initButtons() {
        this.btnExpand.addEventListener('click', () => Tab.expandTabListTree(this.root.querySelector('.file-explorer__tree-root')));
        this.btnCollapse.addEventListener('click', () => Tab.collapseTabListTree(this.root.querySelector('.file-explorer__tree-root')));

        if (StorageHelper.getFromStorageList('active-states').includes('explorer-auto-collapse')) {
            this.btnAutoCollapse.classList.add('active');
        }

        this.btnAutoCollapse.addEventListener('click', () => {
            if (this.btnAutoCollapse.classList.toggle('active')) {
                StorageHelper.addToStorageList('active-states', 'explorer-auto-collapse');
            } else {
                StorageHelper.removeFromStorageList('active-states', 'explorer-auto-collapse');
            }
        });
    }
    
    _initTree() {
        const tabs = generateTabs(this.fileStructure, this.treeContainer);
        tabs.classList.add('file-explorer__tree-root');
        this.treeContainer.appendChild(tabs);
    }
}


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

        // for (let button of [this.btnExpand, this.btnCollapse, this.btnAutoCollapse]) {
        //     addToolTip(button, 'top');
        // }

        // document.addEventListener("keydown", function(event) {
        //     if (event.altKey && event.key === "1") {
        //         event.preventDefault();
        //         this.btnExpand.click();
        //     }

        //     if (event.altKey && event.key === "2") {
        //         event.preventDefault();
        //         this.btnCollapse.click();
        //     }

        //     if (event.altKey && event.key === "3") {
        //         event.preventDefault();
        //         this.btnAutoCollapse.click();
        //     }
        // });