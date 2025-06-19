export const formatting = {
    formatPathToHash,
    formatHashToPath,
    formatPathToTitle,
    formatPathToLabel,
    encodeSearchParams,
    getDecodedSearchParams,
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

/**
 * 
 * @param {*} path 
 * @param {*bool} styled apply HTML tags to style label 
 * @param {*} separator 
 * @returns 
 */
function formatPathToLabel(path, styled=true, separator=', ') {
    path = decodeURIComponent(path);
    const split = path.split('/')
    const last = split.length - 1;
    const baseName = path.endsWith('.html') ? split[last].replace('.html', '') : split[last];
    const parentName = last > 0 ? split[last - 1] : '';

    if (!styled) {
        let plainTextName = baseName;
        if (parentName) {
            plainTextName += ` ${separator} ${parentName}`;
        }
        return plainTextName;
    }

    if (path.endsWith('.html')) {
        let formatted = `<b>${baseName}</b>`;
        if (parentName) {
            formatted = `${formatted}${separator}<small><i>${parentName}</i></small>`
        }
        return formatted;
    } else {
        let formatted = baseName;
        if (parentName) {
            formatted = `${formatted}${separator}<small>${parentName}</small>`
        }
        return `<i>${formatted}</i>`;
    }
}

function encodeSearchParams(terms) {
    return terms.map(encodeURIComponent).join(','); 
}

function getDecodedSearchParams(keyword, locationHash) {
    const params = new URLSearchParams(locationHash.split('?')[1] || '');
    const raw = params.get(keyword);
    return raw ? raw.split(',').map(decodeURIComponent) : [];
}