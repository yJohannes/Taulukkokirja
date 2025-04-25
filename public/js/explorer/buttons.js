import * as defs from "./defs.js"
import { expandExplorer, collapseExplorer } from "./explorer.js";

export function initExplorerButtons()
{
    const config = {
        delay: { [defs.SHOW]: 500, hide: 200 },
        animation: true,
        trigger: 'hover'  // No persisting tooltips
    }

    const expand = document.getElementById('explorer-expand')
    const collapse = document.getElementById('explorer-collapse')
    const autoCollapse = document.getElementById('explorer-auto-collapse')

    for (let b of [expand, collapse, autoCollapse]) {
        b.setAttribute('data-toggle', 'tooltip');
        b.setAttribute('data-placement', 'top');
        $(b).tooltip(config);
    }
    
    const savedState = localStorage.getItem('explorer-auto-collapse-state');
    if (savedState === "true") {
        autoCollapse.classList.add(defs.ACTIVE);
    }

    autoCollapse.addEventListener('click', () => {
        autoCollapse.classList.toggle(defs.ACTIVE);
        localStorage.setItem("explorer-auto-collapse-state", autoCollapse.classList.contains(defs.ACTIVE));
    });

    expand.addEventListener('click', () => {
        expandExplorer();
    });

    collapse.addEventListener('click', () => {
        collapseExplorer();
    });
}