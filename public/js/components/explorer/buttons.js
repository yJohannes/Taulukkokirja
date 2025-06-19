import { addToolTip } from "../common/tooltip.js";
import { Tab } from "../../../components/tab/tab.js";
import { StorageHelper } from "../storage/index.js";

export const buttons = {
    init,
};

function init() {
    // const expand = document.createElement('button');
    // const collapse = document.createElement('button');
    // const autoCollapse = document.createElement('button');

    const expand = document.getElementById('explorer-expand')
    const collapse = document.getElementById('explorer-collapse')
    const autoCollapse = document.getElementById('explorer-auto-collapse')

    for (let button of [expand, collapse, autoCollapse]) {
        addToolTip(button, 'top');
    }
    
    if (StorageHelper.getFromStorageList('active-states').includes('explorer-auto-collapse')) {
        autoCollapse.classList.add('active');
    }

    autoCollapse.addEventListener('click', () => {
        if (autoCollapse.classList.toggle('active')) {
            StorageHelper.addToStorageList('active-states', 'explorer-auto-collapse');
        } else {
            StorageHelper.removeFromStorageList('active-states', 'explorer-auto-collapse');
        }
    });

    expand.addEventListener('click', () => Tab.expandTabListTree(document.getElementById('explorer-tabs-root')));
    collapse.addEventListener('click', () => Tab.collapseTabListTree(document.getElementById('explorer-tabs-root')));

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