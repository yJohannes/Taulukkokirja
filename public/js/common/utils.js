export const utils = {
    showElement,
    isElementVisible,
}

function showElement(isVisible, element) {
    if (isVisible)
        element.classList.remove('hidden');
    else
        element.classList.add('hidden');
}

function isElementVisible(element) {
    return !element.classList.contains('hidden');
}