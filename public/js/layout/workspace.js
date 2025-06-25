import { SplitGrid } from "./split-grid.js";

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
  window.gridManager.setRow(2, true);
  window.gridManager.setRow(3, true);
  SplitGrid.saveGridState();
}

export function hideWorkspace() {
  window.gridManager.setRow(2, false);
  window.gridManager.setRow(3, false);
  SplitGrid.saveGridState();
}