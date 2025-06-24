import { SplitGrid } from "./split-grid.js";
import { elementUtils } from "../utils/element-utils.js";


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

   elementUtils.showElement(true, document.getElementById('main-workspace-splitter'));
   elementUtils.showElement(true, document.getElementById('workspace'));

    SplitGrid.saveGridState();
}

export function hideWorkspace() {
    const rowStyle = SplitGrid.ref.style.gridTemplateRows;
    const split = rowStyle.split(' ');
    
    cachedPageHeight = split[0];
    cachedWorkspaceHeight = split[2];

   elementUtils.showElement(false, document.getElementById('main-workspace-splitter'));
   elementUtils.showElement(false, document.getElementById('workspace'));
    
    SplitGrid.ref.style.gridTemplateRows = `1fr 0px 0px`;
    SplitGrid.saveGridState();
}

const originalColumnWidths = new Map();

export function toggleGridColumn(grid, columnIndex, visible) {
  if (!grid) return;

  const style = getComputedStyle(grid);
  const currentColumns = (grid.style.gridTemplateColumns || style.gridTemplateColumns).split(' ');

  if (columnIndex < 0 || columnIndex >= currentColumns.length) return;

  const key = `${grid.dataset.gridId || grid.id || 'grid'}-${columnIndex}`;

  if (visible) {
    // Restore width
    if (originalColumnWidths.has(key)) {
      currentColumns[columnIndex] = originalColumnWidths.get(key);
      originalColumnWidths.delete(key);
    }
  } else {
    // Save current width before hiding
    if (!originalColumnWidths.has(key)) {
      originalColumnWidths.set(key, currentColumns[columnIndex]);
    }
    currentColumns[columnIndex] = '0px';
  }

  grid.style.gridTemplateColumns = currentColumns.join(' ');

  // Toggle visibility of children in the column
  const children = Array.from(grid.children);
  children.forEach(child => {
    const colStart = parseInt(getComputedStyle(child).gridColumnStart || '0', 10);
    if (colStart === columnIndex + 1) {
      child.style.display = visible ? '' : 'none';
    }
  });
}