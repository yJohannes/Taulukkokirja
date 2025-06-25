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
            prevRows: GridManager.getTemplateSizes(this.grid, 'row'),
            prevCols: GridManager.getTemplateSizes(this.grid, 'col'),
        }

        this.rowCount = GridManager.getTemplateSizes(this.grid, 'row').length;
        this.colCount = GridManager.getTemplateSizes(this.grid, 'col').length;
    }

    setRow(i, isVisible) {
        const rowChildren = GridManager.getDirectionChildren(this.grid, i, 'row');
        const rows = GridManager.getTemplateSizes(this.grid, 'row');
        
        // Build the new sizes on newRows
        const newRows = [...rows];
        if (!isVisible) {
            // Save size
            this.data.prevRows[i - 1] = rows[i - 1];
            newRows[i - 1] = '0px';

            for (const child of rowChildren) {
                child.classList.add('d-none');
            }
        } else {
            const cachedSize = this.data.prevRows[i - 1];
            newRows[i - 1] = cachedSize;

            for (const child of rowChildren) {
                child.classList.remove('d-none');
            }
        }
        
        this.grid.style.gridTemplateRows = newRows.join(' ');
        this.saveData();
        
        // console.log(rowChildren);
        // console.log('prevRows:', this.data.prevRows);
        // console.log('newRows:', newRows);
        
    }

    setCol(i, isVisible) {
        const colChildren = GridManager.getDirectionChildren(this.grid, i, 'col');
        const cols = GridManager.getTemplateSizes(this.grid, 'col');
        
        // Build the new sizes on newcols
        const newCols = [...cols];
        if (!isVisible) {
            // Save size
            this.data.prevCols[i - 1] = cols[i - 1];
            newCols[i - 1] = '0px';

            for (const child of colChildren) {
                child.classList.add('d-none');
            }
        } else {
            const cachedSize = this.data.prevCols[i - 1];
            newCols[i - 1] = cachedSize;

            for (const child of colChildren) {
                child.classList.remove('d-none');
            }
        }
        
        this.grid.style.gridTemplateColumns = newCols.join(' ');
        this.saveData();
        
        // console.log(colChildren);
        // console.log('prevCols:', this.data.prevCols);
        // console.log('newCols:', newCols);
        
    }



    saveData() {
        localStorage.setItem(this.storageID, JSON.stringify(this.data));
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
    static getTemplateSizes(grid, direction) {
        if (direction === 'row')
            return grid.style.gridTemplateRows.split(' ');
        else if (direction === 'col')
            return grid.style.gridTemplateColumns.split(' ');
    }
}