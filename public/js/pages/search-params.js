export function encodeSearchParams(terms) {
    return terms.map(encodeURIComponent).join(','); 
}

export function getDecodedSearchParams(keyword) {
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    const raw = params.get(keyword);
    return raw ? raw.split(',').map(decodeURIComponent) : [];
}