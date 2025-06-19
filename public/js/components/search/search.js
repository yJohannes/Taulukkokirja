import { Pages } from "../../pages/index.js";

let miniSearch;
const searchConfig = {
    fields: ['title', 'content'],
    storeFields: ['id', 'title'], // what we want to get back in results
    fieldOptions: {
        title: { boost: 2 },     // boost title weight by 2
        content: { boost: 1 }    // default weight
    },
    searchOptions: {
        fuzzy: 0.1,
        prefix: true,
    }
};

export const Search = {
    miniSearch,
    searchConfig,
    init,
    search,
}

async function init() {
    const savedIndex = localStorage.getItem('search-index');
    if (savedIndex)
        miniSearch = MiniSearch.loadJSON(savedIndex, searchConfig);

    const updatedSearch = new MiniSearch(searchConfig)
    await indexPages(updatedSearch);

    miniSearch = updatedSearch;
    
    const serializedIndex = JSON.stringify(miniSearch.toJSON());
    localStorage.setItem('search-index', serializedIndex);
}

function search(query) {
    if (localStorage.getItem('search-index'))
        return miniSearch.search(query);
    else
        console.error('Search index not initialized.');
}

async function indexPages(miniSearch) {
    const structure = await Pages.loading.fetchPageStructure();
    const paths = Pages.loading.extractPageStructurePaths(structure);

    for (let path of paths) {
        try {
            const response = await fetch(encodeURI(path));
            const html = await response.text();
            
            // Strip HTML to plain text
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const content = tempDiv.textContent || tempDiv.innerText || '';
            
            miniSearch.add({ id: path, title: Pages.formatting.formatPathToLabel(path, false), content: content });
        } catch (err) {
            console.error(`Failed to fetch ${path}`, err);
        }
    }
}