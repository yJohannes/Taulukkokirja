import * as defs from "./defs.js"
import { expandExplorer, collapseExplorer } from "./explorer.js";
import { addToolTip } from "../tooltip.js";
import { addRippleToElement } from "../../effects/ripple.js";

export function initExplorerButtons()
{
    const expand = document.getElementById('explorer-expand')
    const collapse = document.getElementById('explorer-collapse')
    const autoCollapse = document.getElementById('explorer-auto-collapse')

    for (let button of [expand, collapse, autoCollapse]) {
        addToolTip(button, 'top');
        addRippleToElement(button);
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