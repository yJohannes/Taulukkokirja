import { indexPages } from "./indexing.js";

let miniSearch;

const searchConfig = {
    fields: ['title', 'content'],
    storeFields: ['id', 'title'], // what we want to get back in results
    // searchOptions: {
    //     boost: { title: 2 }, // boost title field importance
    //     fuzzy: 0.1,
    //     prefix: true
    // }
};

export async function initSearch() {
    miniSearch = new MiniSearch(searchConfig);

    const savedIndex = localStorage.getItem('search-index');
    if (savedIndex) {
        const parsedIndex = JSON.parse(savedIndex);
        miniSearch.index = parsedIndex;
    } else {
        await indexPages(miniSearch);
        const serializedIndex = JSON.stringify(miniSearch.toJSON());
        localStorage.setItem('search-index', serializedIndex);
    }
}

export function search(query) {
    console.log(miniSearch.index)
    console.log(miniSearch.search('fys'))
    return miniSearch.search(query, searchConfig);
}