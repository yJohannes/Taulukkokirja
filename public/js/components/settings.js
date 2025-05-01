function loadSettings() {
    document.documentElement.style.setProperty('--color-accent', localStorage.getItem('--color-accent'));
    document.documentElement.style.setProperty('--color-focus', localStorage.getItem('--color-focus'));
}

export { loadSettings }