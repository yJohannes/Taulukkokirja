import { indexPages } from "./indexing.js";

let miniSearch;

const searchConfig = {
    fields: ['title', 'content'],
    storeFields: ['id', 'title'], // what we want to get back in results
    searchOptions: {
        fuzzy: 0.2,
        prefix: true
    }
};

export async function initSearch() {
    miniSearch = new MiniSearch(searchConfig);

    const savedIndex = localStorage.getItem('search-index');
    if (savedIndex) {
        miniSearch = MiniSearch.loadJSON(savedIndex, searchConfig);
    } else {
        await indexPages(miniSearch);
        const serializedIndex = JSON.stringify(miniSearch.toJSON());
        localStorage.setItem('search-index', serializedIndex);
    }
}

export function search(query) {
    if (localStorage.getItem('search-index')) {
        return miniSearch.search(query);
    } else {
        console.error('Search index not initialized.');
    }
}