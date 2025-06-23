

/**
 * @brief Tied state -- width/height = 0 means display = none but 0px doesn't affect display.
 * Indexing is 1-based.
 */
export class GridManager {
    /**
     * @param {HTMLElement} grid
     */
    constructor(grid, storageID) {
        this.grid = grid;
        this.storageID = storageID;
        this.data = JSON.parse(localStorage.getItem(storageID)) || {
            prevRows: [],
            prevCols: [],
        }

    }

    setRow(i, isVisible) {
        const rowChildren = GridManager.getDirectionChildren(this.grid, i, 'row');
        const rows = GridManager.getTemplateSizes(this.grid, 'row');
        this.data.prevRows = rows;

        rows[i-1] = '0'
        const newRows = rows.join(' ');
        this.grid.style.gridTemplateRows = newRows;


        if (isVisible) {
            for (const child of rowChildren) {
                child.classList.remove('d-none');
                this.grid.style.gridTemplateRows = this.data.prevRows;

            }
        } else {
            for (const child of rowChildren) {
                child.classList.add('d-none');
            }
        }

        this.saveData()
    }

    setCol(i, isVisible) {
        const colChildren = GridManager.getDirectionChildren(this.grid, i, 'col');
        const cols = GridManager.getTemplateSizes(this.grid, 'col');
        this.data.prevCols = cols;

        cols[i-1] = '0'
        const newCols = cols.join(' ');
        this.grid.style.gridTemplateColumns = newCols;


        if (isVisible) {
            for (const child of colChildren) {
                this.grid.style.gridTemplateCols = this.data.prevCols;
                child.classList.remove('d-none');
            }
        } else {
            for (const child of colChildren) {
                child.classList.add('d-none');
            }
        }

        this.saveData()
    }

    saveData() {
        localStorage.setItem(this.storageID, JSON.stringify(this.data));
    }
    
    /**
     * 
     * @param {string} direction row/col
     */
    static getDirectionChildren(grid, i, direction) {
        const r = [];
        const property = direction === 'col' ? 'grid-column-start' : 'grid-row-start';
        const children = grid.children;
        
        for (let child of children) {
            const style = window.getComputedStyle(child);

            const childIndex = style.getPropertyValue(property);

            if (parseInt(childIndex) === i) {
                console.log(child);
                r.push(child);
            }
        }

        return r;
    }

    /**
     * 
     * @param {string} direction - row/col
     */
    static getTemplateSizes(grid, direction) {
        if (direction === 'row')
            return getComputedStyle(grid).gridTemplateRows.split(' ');
        else if (direction === 'col')
            return getComputedStyle(grid).gridTemplateColumns.split(' ');
    }
}