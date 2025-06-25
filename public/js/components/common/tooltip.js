const toolTipOptions = {
    delay: { show: 500, hide: 200 },
    animation: true,
    trigger: 'hover'  // No persisting tooltips
};

/**
 * Add tooltip to an element
 * @param {*} element 
 * @param {*} placement 
 * @param {*} tip overrides element's title attribute
 */
export function addToolTip(element, placement, tip=null) {
    // element.setAttribute('data-bs-toggle', 'tooltip');
    element.setAttribute('data-bs-placement', placement);
    
    if (tip) {
        element.setAttribute('title', tip);
    }

    new bootstrap.Tooltip(element, toolTipOptions);
}