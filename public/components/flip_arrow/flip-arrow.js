export const FlipArrow = {
    createArrow,
    toggleArrow,
    setArrowFlip,
}

const FLIP_ARROW_STYLE_ID = 'flip-arrow-styles';

function createArrow() {
    injectArrowStyles();

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "m7 14 5-5 5 5z");  // Traces a neat arrow
    
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrow.classList.add('flip-arrow');
    arrow.setAttribute("viewBox", "0 0 24 24");
    arrow.appendChild(path);

    return arrow;
}

function toggleArrow(arrow) {
    arrow?.classList.toggle('flipped');
}

function setArrowFlip(isFlipped, arrow) {
    if (isFlipped)
        arrow?.classList.add('flipped');
    else
        arrow?.classList.remove('flipped');
}

function injectArrowStyles() {
    if (document.getElementById(FLIP_ARROW_STYLE_ID)) return; // Already injected

    const style = document.createElement('style');
    style.id = FLIP_ARROW_STYLE_ID;
    style.textContent = `
        .flip-arrow {
            width: 24px;
            min-width: 24px;
            height: 24px;
            fill: var(--color-arrow);
            transition: transform 0.3s ease;
            transform: rotate(180deg);
        }

        .flip-arrow.flipped {
            fill: var(--color-arrow-flipped);
            transform: rotate(360deg);
        }
    `;

    document.head.appendChild(style);
}