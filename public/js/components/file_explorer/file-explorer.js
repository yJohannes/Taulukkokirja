import { SearchBar } from '../../../components/search_bar/search-bar.js';
import { Tab } from "../../../components/tab/tab.js";
import { FlipArrow } from '../../../components/flip_arrow/flip-arrow.js';
import { getHeatColor, normalization } from '../../utils/colors.js';
import { updateBookmarks } from '../bookmarks/bookmarks.js';
import { Search } from '../search/search.js';
import { Pages } from '../../pages/index.js';
import { highlightTerms } from '../../effects/highlight-terms.js';
import { elementUtils } from '../../utils/element-utils.js';
import { FileExplorerUtils } from './utils.js';

export class FileExplorer {
    constructor(fileStructure, parent, storageKey) {
        this.fileStructure = fileStructure;
        this.parent = parent;
        this.storageKey = storageKey;
        this.data = {
            autoCollapse: false,
            lastActiveTab: null,
            openedFolderPaths: [],
        }

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
                        style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem;"
                    >
                        <i class="bi bi-arrows-expand" style="font-size: 120%"></i>
                    </button>
                    <button
                        class="file_explorer__button-collapse btn btn-sm ripple ripple-dark ripple-centered hover-glow"
                        title="Sulje välilehdet (alt + 2)" aria-label="Sulje välilehdet"
                        style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem;"
                    >
                        <i class="bi bi-arrows-collapse" style="font-size: 120%"></i>
                    </button>
                    <button
                        class="file_explorer__button-auto-collapse btn btn-sm ripple ripple-dark ripple-centered hover-glow"
                        title="Automaattinen sulkeminen (alt + 3)" aria-label="Automaattinen sulkeminen"
                        style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem;"
                    >
                        <i class="bi bi-list-nested" style="font-size: 120%"></i>
                    </button>
                </div>
            </div>
            <nav class="file-explorer__tree-container rounded w-100"></nav>
            <nav class="file-explorer__search-result-container rounded w-100">
                <div class="file-explorer__search-results-info d-flex flex-row justify-content-between align-items-center gap-2 py-2 px-1 mt-3"></div>
                <hr>
                <div class="file-explorer__search-results"></div>
            </nav>
        `;
    
        this.searchBar = this.root.querySelector('.file-explorer__search-bar');
        this.buttonGroup = this.root.querySelector('.file-explorer__buttons');
        this.btnExpand = this.root.querySelector('.file_explorer__button-expand');
        this.btnCollapse = this.root.querySelector('.file_explorer__button-collapse');
        this.btnAutoCollapse = this.root.querySelector('.file_explorer__button-auto-collapse');
        this.treeContainer = this.root.querySelector('.file-explorer__tree-container');
        this.searchResultContainer = this.root.querySelector('.file-explorer__search-result-container');
        this.searchResultsInfo = this.root.querySelector('.file-explorer__search-results-info');
        this.searchResults = this.root.querySelector('.file-explorer__search-results');
    
        this.data = JSON.parse(localStorage.getItem(this.storageKey)) || this.data;

        this._initSearch();
        this._initButtons();
        this._initTree();
        this._loadSave();

        this.parent.appendChild(this.root);
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
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
                this.createResultView(matches);

                //  Highlight titles in search
                if (matches.length > 0) {
                    const titleMatches = Search.search(query, { boost: { title: 2, content: 0 } })

                    // Merge all matched terms to avoid redundant highlighting
                    const uniqueTerms = [...new Set(titleMatches.flatMap(m => m.terms))];
                    highlightTerms(this.searchResults, uniqueTerms);
                }
            }
        });
    }

    _initButtons() {
        this.btnExpand.addEventListener('click', () => Tab.expandTabListTree(this.root.querySelector('.file-explorer__tree-root')));
        this.btnCollapse.addEventListener('click', () => Tab.collapseTabListTree(this.root.querySelector('.file-explorer__tree-root')));

        if (this.data.autoCollapse) {
            this.btnAutoCollapse.classList.add('active');
        }

        this.btnAutoCollapse.addEventListener('click', () => {
            if (this.btnAutoCollapse.classList.toggle('active')) {
                this.data.autoCollapse = true;
                this.saveData();
                // StorageHelper.addToStorageList('active-states', 'explorer-auto-collapse');
            } else {
                this.data.autoCollapse = false;
                this.saveData();
                // StorageHelper.removeFromStorageList('active-states', 'explorer-auto-collapse');
            }
        });
    }
    
    _initTree() {
        const tabs = this.createTreeView(this.treeContainer, this.fileStructure.pages, 'pages');
        tabs.classList.add('file-explorer__tree-root');
        this.treeContainer.appendChild(tabs);
    }

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
                        // if (StorageHelper.getFromStorageList('show-states').includes(path)) {
                        if (this.data.openedFolderPaths.includes(path)) {
                            const dropdown = item.querySelector('.tab-list');
                            dropdown?.classList.add('show');
                            
                            FlipArrow.setArrowFlip(true, tab.querySelector(`svg`));
                        }
                    }
                });
            });
        });
    }

    // setTabActivity(isActive, tab) {

        // this.data.lastActiveTab = 

        // tab.classList.add('active');
        // localStorage.setItem()
    // }

    onTabClick(parent, tab, isDropdown) {
        const activeTabs = parent.querySelectorAll(`.${'active'}`);
        activeTabs.forEach(t => t.classList.remove('active'));

        // Handle basic tabs
        if (!isDropdown) {
            // StorageHelper.addToStorageList('active-states', tab.getAttribute('data-path'));
            tab.classList.add('active');
            return;
        }
        
        // Handle collapsible tabs
        const nestedDropdown = Tab.getTabDropdown(tab);

        // If closing a dropdown, shift focus up a level
        if (nestedDropdown.classList.contains('show')) {
            nestedDropdown.classList.remove('show');

            this.data.openedFolderPaths = this.data.openedFolderPaths.filter(item => item !== tab.getAttribute('data-path'));
            this.saveData();

            const parentDropdown = tab.parentElement.parentElement;
            const parentTab = parentDropdown.parentElement.querySelector('button');

            // Dismiss highest level dropdown
            if (!(parentDropdown.classList.contains('file-explorer__tree-root') )) {
                parentTab.classList.add('active');
                
                this.data.openedFolderPaths.push(parentTab.getAttribute('data-path'));
                this.saveData();
            }

        } else {
            const autoCollapseOn = this.btnAutoCollapse.classList.contains('active');
            
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
                        
                this.data.openedFolderPaths = this.data.openedFolderPaths.filter(item => item !== tab.getAttribute('data-path'));
                this.saveData();
                });
            }

            // Set tab as 'active' and show contents
            tab.classList.add('active');
            nestedDropdown.classList.add('show');

            this.data.openedFolderPaths.push(tab.getAttribute('data-path'));
            this.saveData();
        }
    }

    // TODO: make static eventually 
    createTreeView(parent, treeData, rootPath = '') {
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

                const tab = Tab.createTab({
                    innerHTML: pageName,
                    href: currentPath,
                    isDropdown: isFolder,
                    nestLevel: level,
                    rippleColor: 'light',
                });

                tab.addEventListener('click', () => this.onTabClick(parent, tab, isFolder));

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


    // TODO: make static eventually 
    createResultView(matches) {
        this.searchResultsInfo.innerHTML = `
                <h5 class="file-explorer__search-results-text m-0">
                    <b>Haun tulokset</b>
                </h5>
                <h4 class="file-explorer__search-results-hits m-0">
                    <span class="badge">${matches.length} osumaa</span>
                </h4>
            `

        if (matches.length === 0) {
            this.searchResults.innerHTML += '<pre class="ps-2">Ei tuloksia</pre>'
            return;
        }

        const maxScore = Math.max(...matches.map(r => r.score));

        for (const match of matches) {
            const score = match.score.toFixed(1); Math.round(match.score);
            const heatColor = getHeatColor(match.score, maxScore, normalization.log);
            
            const path = match.id;
            const name = Pages.formatting.formatPathToLabel(path);
            const tab = Tab.createTab({innerHTML: name, href: path});
            
            const tabHref = tab.getAttribute('href');
            tab.setAttribute('href', tabHref + `?highlight=${Pages.formatting.encodeSearchParams(match.terms)}`)
            tab.classList.add('p-2', 'pe-5');

            // TODO: move this outside and pass callbacks as args 
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
            this.searchResults.appendChild(tab);
        }
    }
}