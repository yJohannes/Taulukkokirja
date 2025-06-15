export const formatting = {
    formatPathToHash,
    formatHashToPath,
    formatPathToTitle,
}

function formatPathToHash(path) {
    return path ? '#/' + path.replaceAll(' ', '_').replace('.html', '') : '';
}

function formatHashToPath(hash) {
    hash = hash.split('?')[0]
    hash = decodeURIComponent(hash);
    hash = hash
        .replace('#/', '')
        .replaceAll('_', ' ');
    
    if (!hash) return '';

    return hash += '.html';
}

function formatPathToTitle(path) {
    const segments = path.split('/');
    let page = decodeURIComponent(segments.pop().replace('.html', ''));
    let folder = segments.length ? decodeURIComponent(segments.pop()) : '';
    return [page, folder, 'Taulukkokirja'].filter(Boolean).join(' | ');
}

}