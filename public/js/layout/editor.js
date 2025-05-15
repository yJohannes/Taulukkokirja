import { saveGridState } from "../components/split-grid.js";

const grid = document.getElementById('content-wrapper');
const editor = document.getElementById('editor');

let cachedPageHeight = '0px';
let cachedEditorHeight = '0px';

export function toggleEditor() {
    const rowStyle = grid.style.gridTemplateRows;
    const split = rowStyle.split(' ');

    const isHidden = split[split.length - 1] === '0px';
    isHidden ? showEditor() : hideEditor();
}

export function showEditor() {
    const rowStyle = grid.style.gridTemplateRows;
    const split = rowStyle.split(' ');
    
    if (cachedEditorHeight === '0px')
        grid.style.gridTemplateRows = `2fr 1px 1fr`;
    else
        grid.style.gridTemplateRows = `${cachedPageHeight} 1px ${cachedEditorHeight}`;

    saveGridState();
}

export function hideEditor() {
    const rowStyle = grid.style.gridTemplateRows;
    const split = rowStyle.split(' ');
    
    cachedPageHeight = split[0];
    cachedEditorHeight = split[2];

    grid.style.gridTemplateRows = `1fr 0px 0px`;
    saveGridState();
}

/*
rowMinSizes:
    0: 300,
    2: 44,
*/
export function maximizeEditor() {
    const gridHeight = parseFloat(getComputedStyle(grid).height);
    const row0Ratio = 300 / gridHeight;
    const row2Ratio = 1 - row0Ratio;

    grid.style.gridTemplateRows = `${row0Ratio}fr 1px ${row2Ratio}fr`;
}
export function minimizeEditor() {
    const gridHeight = parseFloat(getComputedStyle(grid).height);
    const row2Ratio = 44 / gridHeight;
    const row0Ratio = 1 - row2Ratio;

    grid.style.gridTemplateRows = `${row0Ratio}fr 1px ${row2Ratio}fr`;
}


const maximizeBtn = document.getElementById('maximize-editor');
const minimizeBtn = document.getElementById('minimize-editor');
const closeBtn = document.getElementById('close-editor');

minimizeBtn.addEventListener('click', () => {
    minimizeEditor();
})

maximizeBtn.addEventListener('click', () => {
    maximizeEditor();
})

closeBtn.addEventListener('click', () => {
    hideEditor();
})