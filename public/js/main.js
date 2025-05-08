import * as explorer from './components/explorer/index.js'

import { initSplitGrid } from './components/split-grid.js';
import { initPageLoading } from './components/pages.js';
import { initSidebar } from './layout/sidebar.js';
import { initNavbar } from './layout/navbar.js';
import { loadSettings } from './components/settings.js';
import * as editor from './rich-text-editor/index.js'
import * as bookmarks from './components/bookmarks/index.js';
import * as search from './components/search/index.js';

import { loadPageToElement } from './components/pages.js';

document.addEventListener('DOMContentLoaded', async () => {
    // loadPageToElement('Kirjanmerkit.html', 'sidebar-2-content', false)

    initSplitGrid();
    initPageLoading();
    initNavbar();
    initSidebar();
    explorer.initSearchToInput(document.getElementById('explorer-search'))
    bookmarks.updateBookmarks();

    await explorer.loadExplorerToElement(document.getElementById('explorer-container'));
    explorer.loadExplorerSave();
    loadSettings();

    editor.init();

    // function extractPaths(obj, basePath = '') {
    //     const paths = [];
      
    //     for (const [key, value] of Object.entries(obj)) {
    //       const currentPath = basePath ? `${basePath}/${key}` : key;
      
    //       if (value === null) {
    //         // It's a file
    //         paths.push(currentPath);
    //       } else if (typeof value === 'object') {
    //         // It's a folder
    //         paths.push(...extractPaths(value, currentPath));
    //       }
    //     }
      
    //     return paths;
    //   }

    // const response = await fetch('/api/pages-structure');
    // const json = await response.json();
    // const paths = extractPaths(json);
    
    // // Initialize MiniSearch
    // const miniSearch = new MiniSearch({
    //     fields: ['title', 'content'],
    //     storeFields: ['id', 'title'],
    //     searchOptions: {
    //     boost: { title: 2 },
    //     fuzzy: 0.2,
    //     prefix: true
    //     }
    // });

  
    // // Fetch and index all pages
    // async function indexPages() {
    //     const documents = [];
    
    //     let c = 0;
    //     for (let page of paths) {
    //         try {
    //             const response = await fetch('pages/' + page);
    //             const html = await response.text();
        
    //             // Strip HTML to plain text
    //             const tempDiv = document.createElement('div');
    //             tempDiv.innerHTML = html;
    //             const content = tempDiv.textContent || tempDiv.innerText || '';
        
    //             documents.push({ id: c, title: page, content: content });
    //         } catch (err) {
    //         }
    //         c++;
    //     }
    
    //     // Add to index
    //     miniSearch.addAll(documents);
    
    // }
    
    // // Run the indexing process (or load if it exists)
    // indexPages();
    
    // const results = miniSearch.search('fys')

    // console.log(results)
    // results.forEach(result => {
    //     console.log(`${result.title} (score: ${result.score.toFixed(2)})`);
    // });

    await search.initSearch();

    const results = search.search('fys');
    console.log(results)
    results.forEach(result => {
        console.log(`${result.title} (score: ${result.score.toFixed(2)})`);
    });
});