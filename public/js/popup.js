let popupTimeout;

function showPopup(text) {
    const popup = document.getElementById('popup');
    const span = popup.querySelector('span');
    span.textContent = text;

    if (popup.classList.contains('show')) {
        clearTimeout(popupTimeout);
        popup.style.transition = 'none'
        popup.classList.remove('show');

        // Force a reflow (to apply the instant removal)
        void popup.offsetHeight;

        popup.style.transition = 'all 0.15s ease-out';
    }
    popup.classList.add('show');

    // Hide the popup after 2 seconds
    popupTimeout = setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}
