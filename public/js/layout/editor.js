const grid = document.getElementById('content-wrapper')
const editor = document.getElementById('editor')

let hidden
let cachedPageHeight
let cachedEditorHeight

export function toggleEditor() {
    hidden ? showEditor() : hideEditor();
}

export function showEditor() {
    const rowStyle = grid.style.gridTemplateRows
    const split = rowStyle.split(' ')
    grid.style.gridTemplateRows = `${cachedPageHeight} 1px ${cachedEditorHeight}`
    hidden = false 
}

export function hideEditor() {
    const rowStyle = grid.style.gridTemplateRows
    const split = rowStyle.split(' ')
    cachedPageHeight = split[0]
    cachedEditorHeight = split[2]
    grid.style.gridTemplateRows = `1fr 0px 0px`
    hidden = true
}

/*
rowMinSizes:
    0: 300,
    2: 44,
*/
export function maximizeEditor() {
    const gridHeight = parseFloat(getComputedStyle(grid).height)
    const row0Ratio = 300 / gridHeight
    const row2Ratio = 1 - row0Ratio

    grid.style.gridTemplateRows = `${row0Ratio}fr 1px ${row2Ratio}fr`
}
export function minimizeEditor() {
    const gridHeight = parseFloat(getComputedStyle(grid).height)
    const row2Ratio = 44 / gridHeight
    const row0Ratio = 1 - row2Ratio

    grid.style.gridTemplateRows = `${row0Ratio}fr 1px ${row2Ratio}fr`
}


const maximizeBtn = document.getElementById('maximize-editor')
const minimizeBtn = document.getElementById('minimize-editor')
const closeBtn = document.getElementById('close-editor')

minimizeBtn.addEventListener('click', () => {
    minimizeEditor()
})

maximizeBtn.addEventListener('click', () => {
    maximizeEditor()
})

closeBtn.addEventListener('click', () => {
    hideEditor()
})