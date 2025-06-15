import { getTabDropdown } from './index.js';
import * as storage from '../storage/index.js';

export function showExplorer(bool)
{
    const explorerContainer = document.getElementById('explorer-nav-container');

    if (bool) {
        explorerContainer.style.display = 'inline-block';
    } else {
        explorerContainer.style.display = 'none';

    }
}

export function expandExplorer()
{
    const explorer = document.querySelector('#explorer-nav-container');
    const uls = explorer.querySelectorAll('.explorer-ul');
    
    // Expand all dropdowns and flip arrows
    uls.forEach(ul => {
        ul.classList.add('show');
        
        const lis = ul.querySelectorAll('li');
        lis.forEach((li) => {
            const tabs = li.querySelectorAll('.tab');
            tabs.forEach((tab) => {
                storage.addToStorageList('show-states', tab.getAttribute('data-path'));

                const arrowSvg = tab.querySelector(`svg`);
                if (arrowSvg) {
                    arrowSvg.classList.add('flipped');
                }
            });
        });
    });
}

export function collapseExplorer()
{
    const explorer = document.querySelector('#explorer-nav-container');
    const uls = explorer.querySelectorAll('.explorer-ul');
    
    // Collapse all dropdowns and unflip arrows
    uls.forEach(ul => {
        ul.classList.remove('show');
        
        
        const lis = ul.querySelectorAll('li');
        lis.forEach((li) => {
            const tabs = li.querySelectorAll('.tab');
            tabs.forEach((tab) => {
                tab.classList.remove('active');
                storage.removeFromStorageList('show-states', tab.getAttribute('data-path'));
                
                const arrowSvg = tab.querySelector(`svg`);
                if (arrowSvg) {
                    arrowSvg.classList.remove('flipped');
                }
            });
        });
    });
}

export function openPath(path) {
    const explorer = document.querySelector('#explorer-nav-container');
    const parts = path.split('/'); // Split the path into parts for navigation
    let joinPath = '';

    for (const part of parts) {
        joinPath = joinPath ? joinPath + '/' + part : part;

        // Don't try to get the pages tab which doesn't exist
        if (joinPath === 'pages') continue;

        const tabClass = `.tab[data-path="${joinPath}"]`;

        const tab = explorer.querySelector(tabClass);
        const dropdown = getTabDropdown(tab);

        if (!dropdown) {
            tab.click();
        } else if (dropdown && !dropdown.classList.contains('show')) {
            tab.click();
        }
    }
}

export function getTabByPath(path) {
    const explorer = document.querySelector('#explorer-nav-container');
    const tabClass = `.tab[data-path="${path}"]`;
    return explorer.querySelector(tabClass);
}

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