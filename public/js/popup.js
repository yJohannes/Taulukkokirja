let popupTimeout;

/**
 * 
 * @param {string} message 
 * @param {string} role success, warning, danger, info
 */
function createPopup(message, role) {
    // Clear any existing popup
    if (popupTimeout) {
        clearTimeout(popupTimeout);
        const existingPopup = document.querySelector('.popup');
        if (existingPopup) {
            existingPopup.remove();
        }
    }

    // Create a new popup element
    const popup = document.createElement('div');
    popup.className = 'popup alert bg-success shadow';
    popup.setAttribute('role', 'alert');

    // SVG icon
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('fill', 'white');
    svg.setAttribute('viewBox', '0 0 448 512');

    if (role === 'success') {
        svg.innerHTML = `<path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>`;
    }

    // Message span
    const span = document.createElement('span');
    span.textContent = message;

    // Append SVG and message to the popup
    popup.appendChild(svg);
    popup.appendChild(span);

    // Append the popup to the body
    document.body.appendChild(popup);

    // Add the "show" class for animation
    requestAnimationFrame(() => {
        popup.classList.add('show');
    });

    // Automatically remove the popup after 2 seconds
    popupTimeout = setTimeout(() => {
        popup.remove();
    }, 2000);
}

export { createPopup };