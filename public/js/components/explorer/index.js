export * from './buttons.js'
export * from './defs.js'
export * from './explorer.js'
export * from './search.js'
export * from './tab.js'

export function formatPathLabel(tabPath) {
    tabPath = decodeURIComponent(tabPath);
    const split = tabPath.split('/')
    const last = split.length - 1;

    if (tabPath.endsWith('.html')) {
        let name = '<b>' + split[last] + '</b>';
        if (last > 0) {
            name = name + ' | <small><i>' + split[last-1] + '</i></small>';
        }
        name = name.replace('.html', '');
        return name;
    } else {
        let name = split[last];
        if (last > 0) {
            name = name + ' | <small>' + split[last-1] + '</small>';
        }
        name = '<i>' + name + '</i>';

        return name;
    }
}