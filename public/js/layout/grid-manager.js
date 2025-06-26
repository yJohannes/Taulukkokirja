/**
 * @class GridManager
 * @classdesc Utility to dynamically toggle visibility of grid rows and columns by setting their size to 0 and hiding associated children.
 * Indexing is 1-based.
 * Assumes the grid uses inline `grid-template-rows` and `grid-template-columns`.
 * This makes it Split-Grid.js compatible.
 */
export class GridManager {
    /**
     * @constructor
     * @param {HTMLElement} gridElement - The CSS grid container element.
     * @param {string} storageKey - A key used to persist visibility state in localStorage.
     */
    constructor(gridElement, storageKey) {
        this.gridElement = gridElement;
        this.storageKey = storageKey;

        this.state = JSON.parse(localStorage.getItem(storageKey)) || {
            previousRowSizes: GridManager.extractTemplateSizes(this.gridElement, 'row'),
            previousColumnSizes: GridManager.extractTemplateSizes(this.gridElement, 'col'),
        }

        this.totalRows = GridManager.extractTemplateSizes(this.gridElement, 'row').length;
        this.totalColumns = GridManager.extractTemplateSizes(this.gridElement, 'col').length;
    }

    setRow(i, isVisible) {
        const rowChildren = GridManager.getDirectionChildren(this.gridElement, i, 'row');
        const rows = GridManager.extractTemplateSizes(this.gridElement, 'row');
        
        // Build the new sizes on newRows
        const newRows = [...rows];
        if (!isVisible) {
            // Save size
            this.state.previousRowSizes[i - 1] = rows[i - 1];
            newRows[i - 1] = '0px';

            for (const child of rowChildren) {
                child.classList.add('d-none');
            }
        } else {
            const cachedSize = this.state.previousRowSizes[i - 1];
            newRows[i - 1] = cachedSize;

            for (const child of rowChildren) {
                child.classList.remove('d-none');
            }
        }
        
        this.gridElement.style.gridTemplateRows = newRows.join(' ');
        this.saveData();
    }

    setCol(i, isVisible) {
        const colChildren = GridManager.getDirectionChildren(this.gridElement, i, 'col');
        const cols = GridManager.extractTemplateSizes(this.gridElement, 'col');
        
        // Build the new sizes on newcols
        const newCols = [...cols];
        if (!isVisible) {
            // Save size
            this.state.previousColumnSizes[i - 1] = cols[i - 1];
            newCols[i - 1] = '0px';

            for (const child of colChildren) {
                child.classList.add('d-none');
            }
        } else {
            const cachedSize = this.state.previousColumnSizes[i - 1];
            newCols[i - 1] = cachedSize;

            for (const child of colChildren) {
                child.classList.remove('d-none');
            }
        }
        
        this.gridElement.style.gridTemplateColumns = newCols.join(' ');
        this.saveData();
    }



    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }

    /**
     * 
     * @param {string} direction row/col
     * @returns {HTMLElement[]}
     */
    static getDirectionChildren(grid, i, direction) {
        const r = [];
        const property = direction === 'col' ? 'grid-column-start' : 'grid-row-start';
        const children = grid.children;

        for (let child of children) {
            const style = window.getComputedStyle(child);

            const childIndex = style.getPropertyValue(property);

            if (parseInt(childIndex) === i) {
                r.push(child);
            }
        }

        return r;
    }

    /**
     * 
     * @param {string} direction - row/col
     * @param {HTMLElement} grid
     */
    static extractTemplateSizes(grid, direction) {
        if (direction === 'row')
            return grid.style.gridTemplateRows.split(' ');
        else if (direction === 'col')
            return grid.style.gridTemplateColumns.split(' ');
    }
}