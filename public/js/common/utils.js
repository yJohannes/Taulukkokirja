export const utils = {
    showElement,
}

function showElement(isVisible, element) {
    if (isVisible)
        element.classList.remove('hidden');
    else
        element.classList.add('hidden');
}