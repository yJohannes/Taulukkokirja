function setRealVHDesktop() {
    document.documentElement.style.setProperty('--real-vh', `${window.innerHeight * 0.01}px`);
}

function setRealVHMobile() {
    const isZoomed = () => {
        return visualViewport.scale !== 1;
    }

    // We shouldnt update because zooming decreases the visualViewport
    if (!isZoomed()) {
        document.documentElement.style.setProperty('--real-vh', `${window.visualViewport.height * 0.01}px`);
    }
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
