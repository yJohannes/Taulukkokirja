/**
 * @brief
 * Indexing is 1-based.
 * Grid must have template rows & cols written inline
 */
export class GridManager {
    /**
     * @param {HTMLElement} grid
     */
    constructor(grid, storageID) {
        this.grid = grid;
        this.storageID = storageID;
        this.data = JSON.parse(localStorage.getItem(storageID)) || {
            prevRows: null,
            prevCols: null,
        }

    }

    setRow(i, isVisible) {
        const rowChildren = GridManager.getDirectionChildren(this.grid, i, 'row');
        const rows = GridManager.getTemplateSizes(this.grid, 'row');
        this.data.prevRows = rows;

        rows[i-1] = '0'
        const newRows = rows.join(' ');
        this.grid.style.gridTemplateRows = String(newRows);


        if (isVisible) {
            for (const child of rowChildren) {
                child.classList.remove('d-none');
                this.grid.style.gridTemplateRows = this.data.prevRows;

            }
        } else {
            for (const child of rowChildren) {
                child.classList.add('d-none');
                console.log(child);
            }
        }

        this.saveData()
    }

    setCol(i, isVisible) {
        if (i - 1 < 0) {
            console.warn('Invalid column index:', i);
            return;
        }

        // First time setup: store original sizes
        if (!this.data.prevCols) {
            this.data.prevCols = GridManager.getTemplateSizes(this.grid, 'col');
        }

        const colChildren = GridManager.getDirectionChildren(this.grid, i, 'col');

        // Always use the current state as base
        const currentCols = GridManager.getTemplateSizes(this.grid, 'col');
        const newCols = [...currentCols];

        // Cache original size if not already cached and not hidden
        if (!this.data.prevCols[i - 1] || this.data.prevCols[i - 1] === '0px') {
            this.data.prevCols[i - 1] = currentCols[i - 1] !== '0px'
                ? currentCols[i - 1]
                : 'auto'; // fallback
        }

        if (isVisible) {
            const restoreSize = this.data.prevCols[i - 1];
            newCols[i - 1] = restoreSize && restoreSize !== '0px' ? restoreSize : 'auto';
            for (const child of colChildren) {
                child.classList.remove('d-none');
            }
        } else {
            newCols[i - 1] = '0px';
            for (const child of colChildren) {
                child.classList.add('d-none');
            }
        }

        console.log('prevCols:', this.data.prevCols);
        console.log('newCols:', newCols);

        this.grid.style.gridTemplateColumns = newCols.join(' ');
        this.saveData();
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
     * @param {HTMLElement} grid
     */
    static getTemplateSizes(grid, direction) {
        if (direction === 'row')
            return grid.style.gridTemplateRows.split(' ');
        else if (direction === 'col')
            return grid.style.gridTemplateColumns.split(' ');
    }
}