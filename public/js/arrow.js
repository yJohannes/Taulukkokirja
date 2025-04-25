function createArrow()
{
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "m7 14 5-5 5 5z");  // Traces a neat arrow
    
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrow.classList.add('flip-arrow');
    arrow.setAttribute("viewBox", "0 0 24 24");
    arrow.appendChild(path);

    return arrow;
}

export { createArrow };