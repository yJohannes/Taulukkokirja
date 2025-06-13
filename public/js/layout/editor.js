import { saveGridState } from "../components/split-grid.js";

const grid = document.getElementById('content-wrapper');

let cachedPageHeight = '0px';
let cachedEditorHeight = '0px';

export function toggleEditor() {
    const rowStyle = grid.style.gridTemplateRows;
    const split = rowStyle.split(' ');

    const isHidden = split[split.length - 1] === '0px';
    isHidden ? showEditor() : hideEditor();
}

export function showEditor() {
    if (cachedEditorHeight === '0px')
        grid.style.gridTemplateRows = `2fr auto 1fr`;
    else
        grid.style.gridTemplateRows = `${cachedPageHeight} auto ${cachedEditorHeight}`;

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

// 300 and 44 were some max min sizes that don't exist anymore idk
export function maximizeEditor() {
    const gridHeight = parseFloat(getComputedStyle(grid).height);
    const row0Ratio = 300 / gridHeight;
    const row2Ratio = 1 - row0Ratio;

    grid.style.gridTemplateRows = `${row0Ratio}fr auto ${row2Ratio}fr`;
}
export function minimizeEditor() {
    const gridHeight = parseFloat(getComputedStyle(grid).height);
    const row2Ratio = 44 / gridHeight;
    const row0Ratio = 1 - row2Ratio;

    grid.style.gridTemplateRows = `${row0Ratio}fr auto ${row2Ratio}fr`;
}

const maximizeBtn = document.getElementById('maximize-editor');
const minimizeBtn = document.getElementById('minimize-editor');
const closeBtn = document.getElementById('close-editor');

minimizeBtn.addEventListener('click', minimizeEditor)
maximizeBtn.addEventListener('click', maximizeEditor)
closeBtn.addEventListener('click', hideEditor)