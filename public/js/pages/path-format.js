export function sanitizePath(path) {
    path = decodeURIComponent(path);
    path = path.replace('#/', '').replaceAll('_', ' ').replace('.html', '');
    return path;
}

export function formatPathToHash(path) {
    return path ? '#/' + path.replaceAll(' ', '_').replace('.html', '') : '';
}

export function formatLocationHashForFetch(hash) {
    hash = hash.split('?')[0]
    hash = decodeURIComponent(hash);
    hash = hash
        .replace('#/', '')
        .replaceAll('_', ' ');
    
    if (!hash) return '';

    return hash += '.html';
}