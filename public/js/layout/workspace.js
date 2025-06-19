import { SplitGrid } from "./split-grid.js";


let cachedPageHeight = '0px';
let cachedWorkspaceHeight = '0px';

export function isWorkSpaceHidden() {
    const rowStyle = SplitGrid.ref.style.gridTemplateRows;
    const split = rowStyle.split(' ');
    const isHidden = split[split.length - 1] === '0px';
    return isHidden;
}

export function isWorkspaceOpen() {
    return !isWorkSpaceHidden();
}

export function toggleWorkspace() {
    isWorkSpaceHidden() ? showWorkspace() : hideWorkspace();
}

export function showWorkspace() {
    if (cachedWorkspaceHeight === '0px') SplitGrid.ref.style.gridTemplateRows = `1fr auto 300px`;
    else SplitGrid.ref.style.gridTemplateRows = `${cachedPageHeight} auto ${cachedWorkspaceHeight}`;
    SplitGrid.saveGridState();
}

export function hideWorkspace() {
    const rowStyle = SplitGrid.ref.style.gridTemplateRows;
    const split = rowStyle.split(' ');
    
    cachedPageHeight = split[0];
    cachedWorkspaceHeight = split[2];

    SplitGrid.ref.style.gridTemplateRows = `1fr 0px 0px`;
    SplitGrid.saveGridState();
}