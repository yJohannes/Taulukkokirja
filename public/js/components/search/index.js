import { indexPages } from "./indexing.js";

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

export async function initSearch() {
    const savedIndex = localStorage.getItem('search-index');
    if (savedIndex)
        miniSearch = MiniSearch.loadJSON(savedIndex, searchConfig);

    const updatedSearch = new MiniSearch(searchConfig)
    await indexPages(updatedSearch);

    miniSearch = updatedSearch;
    const serializedIndex = JSON.stringify(miniSearch.toJSON());
    localStorage.setItem('search-index', serializedIndex);
}

export function search(query) {
    if (localStorage.getItem('search-index')) {
        return miniSearch.search(query);
    } else {
        console.error('Search index not initialized.');
    }
}