export function formatPathToHash(path) {
    return path ? '#/' + path.replaceAll(' ', '_').replace('.html', '') : '';
}

export function formatHashToPath(hash) {
    hash = hash.split('?')[0]
    hash = decodeURIComponent(hash);
    hash = hash
        .replace('#/', '')
        .replaceAll('_', ' ');
    
    if (!hash) return '';

    return hash += '.html';
}