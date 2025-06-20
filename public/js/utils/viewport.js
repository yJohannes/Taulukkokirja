function setRealVHDesktop() {
    document.documentElement.style.setProperty('--real-vh', `${window.innerHeight * 0.01}px`);
}

function setRealVHMobile() {
    document.documentElement.style.setProperty('--real-vh', `${window.visualViewport.height * 0.01}px`);
}

/**
 * Does exactly what the name suggests
 * --real-vh on mobile excludes keyboard height as well
 */
export function initRealVH() {
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', setRealVHMobile);
        window.visualViewport.addEventListener('load', setRealVHMobile);
        setRealVHMobile();
    } else {
        window.addEventListener('resize', setRealVHDesktop);
        window.addEventListener('load', setRealVHDesktop);
        setRealVHDesktop();
    }
}
