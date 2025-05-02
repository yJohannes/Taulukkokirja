function addToolTip(element, placement, tip=null) {
    element.setAttribute('data-toggle', 'tooltip');
    element.setAttribute('data-placement', placement);
    
    if (tip) {
        element.setAttribute('title', tip);
    }
    
    $(element).tooltip({
        delay: { show: 500, hide: 200 },
        animation: true,
        trigger: 'hover'  // No persisting tooltips
    });
}

export { addToolTip };