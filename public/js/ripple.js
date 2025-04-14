async function addRippleToElement(element)
{
    element.addEventListener('mousedown', (e) => {
        const ripple = document.createElement('div');

        if (element.classList.contains('ripple-dark')) {
            ripple.classList.add('ripple-effect-dark');
        } else {
            ripple.classList.add('ripple-effect-light');
        }

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        let x;
        let y;
        if (element.classList.contains('ripple-centered')) {
            x = rect.width / 2 - size / 2;   // Center horizontally
            y = rect.height / 2 - size / 2;  // Center vertically
        } else {
            x = e.clientX - rect.left - size / 2;
            y = e.clientY - rect.top - size / 2;
        }

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        element.appendChild(ripple);

        let isMouseUp = false;

        const cleanup = () => {
            ripple.remove();
            element.removeEventListener('mouseup', onMouseUp);
            element.removeEventListener('mouseleave', onMouseUp);
        };

        const onMouseUp = () => {
            isMouseUp = true;
            ripple.classList.add('fade-out');
            setTimeout(cleanup, 300); // Match the fade-out duration
        };

        element.addEventListener('mouseup', onMouseUp);
        element.addEventListener('mouseleave', onMouseUp);

        setTimeout(() => {
            if (isMouseUp) onMouseUp();
        }, 600); // Keep the ripple visible for 600ms
    });
}

export async function initRipple()
{
    document.querySelectorAll('.ripple').forEach(element => {
        addRippleToElement(element);
    });
}    