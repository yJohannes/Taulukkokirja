let popupTimeout;

/**
 * 
 * @param {string} message 
 * @param {string} role success, warning, danger, info
 */
export function createPopup(message, role) {
    // Clear any existing popup
    if (popupTimeout) {
        clearTimeout(popupTimeout);
        const $existingPopup = document.querySelector('.popup');
        if ($existingPopup) {
            $existingPopup.remove();
        }
    }

    const $popup = document.createElement('div');
    $popup.className = 'popup shadow';
    $popup.setAttribute('role', 'alert');

    // SVG icon
    const $svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    $svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    $svg.setAttribute('width', '24');
    $svg.setAttribute('height', '24');
    $svg.setAttribute('fill', 'white');
    $svg.setAttribute('viewBox', '0 0 448 512');

    if (role === 'success') {
        $svg.innerHTML = `<path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>`;
        $popup.style.backgroundColor = '#2E6F40'
    }

    // Message span
    const $span = document.createElement('span');
    $span.textContent = message;

    $popup.appendChild($svg);
    $popup.appendChild($span);
    document.body.appendChild($popup);

    // Trigger animation with a small delay to let DOM append
    setTimeout(() => {
        $popup.classList.add('show');
    }, 10);

    popupTimeout = setTimeout(() => {
        $popup.classList.remove('show');

        setTimeout(() => {
            $popup.remove();
        }, 200);
    }, 2000);
}