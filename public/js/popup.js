let popupTimeout;

function createPopUp()
{
    // <div id="popup" class="popup alert bg-success shadow" role="alert">
    //     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 448 512">
    //         <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
    //     </svg>
    //     <span>Popup message</span>
    // </div>
}

function showPopup(text)
{
    const popup = document.getElementById('popup');
    const span = popup.querySelector('span');
    span.textContent = text;

    if (popup.classList.contains('show')) {
        clearTimeout(popupTimeout);
        popup.style.transition = 'none';
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

export { showPopup };