export const elementUtils = {
    showElement,
    toggleVisibility,
    isElementVisible,
}

function toggleVisibility(element) {
    element.classList.toggle('hidden');
}

function showElement(isVisible, element) {
    if (isVisible)
        element.classList.remove('hidden');
    else
        element.classList.add('hidden');
}

function isElementVisible(element) {
  return getComputedStyle(element).display !== 'none';
}