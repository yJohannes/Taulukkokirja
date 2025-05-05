import * as defs from "./defs.js"
import { expandExplorer, collapseExplorer } from "./explorer.js";
import { addToolTip } from "../tooltip.js";
import { addRippleToElement } from "../../effects/ripple.js";
import * as storage from '../storage/index.js';

export function initExplorerButtons()
{
    const expand = document.getElementById('explorer-expand')
    const collapse = document.getElementById('explorer-collapse')
    const autoCollapse = document.getElementById('explorer-auto-collapse')

    for (let button of [expand, collapse, autoCollapse]) {
        addToolTip(button, 'top');
        addRippleToElement(button);
    }
    
    if (storage.getFromStorageList('active-states').includes('explorer-auto-collapse')) {
        autoCollapse.classList.add(defs.ACTIVE);
    }

    autoCollapse.addEventListener('click', () => {
        if (autoCollapse.classList.toggle(defs.ACTIVE)) {
            storage.addToStorageList('active-states', 'explorer-auto-collapse');
        } else {
            storage.removeFromStorageList('active-states', 'explorer-auto-collapse');
        }
    });

    expand.addEventListener('click', () => {
        expandExplorer();
    });

    collapse.addEventListener('click', () => {
        collapseExplorer();
    });

    document.addEventListener("keydown", function(event) {
        if (event.altKey && event.key === "1") {
            event.preventDefault();
            expand.click();
        }

        if (event.altKey && event.key === "2") {
            event.preventDefault();
            collapse.click();
        }

        if (event.altKey && event.key === "3") {
            event.preventDefault();
            autoCollapse.click();
        }
    });
}