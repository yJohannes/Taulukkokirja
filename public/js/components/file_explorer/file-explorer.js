import { SearchBar } from '../../../components/search_bar/search-bar.js';
import { Tab } from "../../../components/tab/tab.js";
import { FlipArrow } from '../../../components/flip_arrow/flip-arrow.js';
import { StorageHelper } from "../storage/index.js";
import { createTreeView } from './tabs.js';

import { getHeatColor, normalization } from '../../utils/colors.js';
import { updateBookmarks } from '../bookmarks/bookmarks.js';
import { Search } from '../search/search.js';
import { Pages } from '../../pages/index.js';
import { highlightTerms } from '../../effects/highlight-terms.js';
import { elementUtils } from '../../utils/element-utils.js';
import { FileExplorerUtils } from './utils.js';

// import { addToolTip } from "../common/tooltip.js";
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
                    <button
                        class="file_explorer__button-expand btn btn-sm ripple ripple-dark ripple-centered hover-glow"
                        title="Laajenna välilehdet (alt + 1)" aria-label="Laajenna välilehdet"
                        style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: 1rem;"
                    >
                        <i class="bi bi-arrows-expand" style="font-size: 120%;"></i>
                    </button>
                    <button
                        class="file_explorer__button-collapse btn btn-sm ripple ripple-dark ripple-centered hover-glow"
                        title="Sulje välilehdet (alt + 2)" aria-label="Sulje välilehdet"
                        style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: 1rem;"
                    >
                        <i class="bi bi-arrows-collapse" style="font-size: 120%;"></i>
                    </button>
                    <button
                        class="file_explorer__button-auto-collapse btn btn-sm ripple ripple-dark ripple-centered hover-glow"
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
    
        this.buttonGroup = this.root.querySelector('.file-explorer__buttons');
        this.btnExpand = this.root.querySelector('.file_explorer__button-expand');
        this.btnCollapse = this.root.querySelector('.file_explorer__button-collapse');
        this.btnAutoCollapse = this.root.querySelector('.file_explorer__button-auto-collapse');

        this.searchBar = this.root.querySelector('.file-explorer__search-bar');

        this.treeContainer = this.root.querySelector('.file-explorer__tree-container');
        this.searchResultContainer = this.root.querySelector('.file-explorer__search-result-container');
    
        this._initSearch();
        this._initButtons();
        this._initTree();
        this._loadSave();

        this.parent.appendChild(this.root);
    }

    _initSearch() {
        SearchBar.makeSearchBar(this.searchBar);

        this.searchBar.addEventListener('input', (e) => {
            const query = e.target.value;
            
            if (query.length <= 0) {
                elementUtils.showElement(true, this.buttonGroup);
                elementUtils.showElement(true, this.treeContainer);
                elementUtils.showElement(false, this.searchResultContainer);

            } else {
                elementUtils.showElement(false, this.buttonGroup);
                elementUtils.showElement(false, this.treeContainer);
                elementUtils.showElement(true, this.searchResultContainer);
                
                const matches = Search.search(query);
                this._generateResultView(matches);

                //  Highlight titles in search
                if (matches.length > 0) {
                    const titleMatches = Search.search(query, { boost: { title: 2, content: 0 } })

                    // Merge all matched terms to avoid redundant highlighting
                    const uniqueTerms = [...new Set(titleMatches.flatMap(m => m.terms))];
                    highlightTerms(this.searchResultContainer, uniqueTerms);
                }
            }
        });
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
        const tabs = createTreeView(this.treeContainer, this.fileStructure.pages, 'pages');
        tabs.classList.add('file-explorer__tree-root');
        this.treeContainer.appendChild(tabs);
    }

    /**
     * Can and will clash if other explorers with same saved paths exist
     */
    _loadSave() {
        const lists = this.root.querySelectorAll('.tab-list');
        
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

    // make static eventually 
    _generateResultView(matches) {
        this.searchResultContainer.innerHTML = `
            <div class="d-flex flex-row justify-content-between align-items-center py-2 ps-1 pe-0 mt-3">
                <h5 class="m-0">
                    <b>Haun tulokset</b>
                </h5>
                <h4 class="m-0">
                    <span class="badge">${matches.length} osumaa</span>
                </h4>
            </div>
            <hr>
            `

        if (matches.length === 0) {
            this.searchResultContainer.innerHTML += '<pre class="ps-1">Ei tuloksia</pre>'
            return;
        }

        const maxScore = Math.max(...matches.map(r => r.score));

        for (const match of matches) {
            const score = match.score.toFixed(1); Math.round(match.score);
            const heatColor = getHeatColor(match.score, maxScore, normalization.log);
            
            const path = match.id;
            const name = Pages.formatting.formatPathToLabel(path);
            const tab = Tab.createTab(name, path);
            
            const tabHref = tab.getAttribute('href');
            tab.setAttribute('href', tabHref + `?highlight=${Pages.formatting.encodeSearchParams(match.terms)}`)
            tab.classList.add('p-2', 'pe-5');
            tab.addEventListener('click', updateBookmarks);

            // Right click opens the tab folder
            tab.addEventListener('contextmenu', (e) => {
                e.preventDefault();

            elementUtils.showElement(true, this.treeContainer);
            elementUtils.showElement(false, this.searchResultContainer);

                const parentPath = path.substring(0, path.lastIndexOf('/'));

                FileExplorerUtils.openPath(this.treeContainer, parentPath);
                FileExplorerUtils.getTabByPath(this.treeContainer, parentPath).scrollIntoView({
                    behavior: 'auto',     // smooth scrolling animation
                    block: 'center',        // align element to center of the viewport
                });

                SearchBar.clearSearchBar(this.searchBar);
            });


            const scoreBadge = document.createElement('div');
            scoreBadge.innerText = score;
            scoreBadge.className = `
                position-absolute
                top-50
                end-0
                translate-middle-y
                text-black
                rounded-start
                px-1
                py-1
            `
            scoreBadge.style.backgroundColor = heatColor;

            tab.appendChild(scoreBadge);
            this.searchResultContainer.appendChild(tab);
        }
    }
}