export * from './buttons.js'
export * from './defs.js'
export * from './explorer.js'
export * from './search.js'
export * from './tab.js'

export function formatPathLabel(tabPath, withHTML=true, separator=', ') {
    tabPath = decodeURIComponent(tabPath);
    const split = tabPath.split('/')
    const last = split.length - 1;
    const baseName = tabPath.endsWith('.html') ? split[last].replace('.html', '') : split[last];
    const parentName = last > 0 ? split[last - 1] : '';

    if (!withHTML) {
        let plainTextName = baseName;
        if (parentName) {
            plainTextName += ` ${separator} ${parentName}`;
        }
        return plainTextName;
    }

    if (tabPath.endsWith('.html')) {
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