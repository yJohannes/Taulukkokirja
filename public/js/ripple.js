async function addRippleToElement(element)
{

    element.addEventListener('mousedown', function (e) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('div');
        ripple.classList.add('ripple-effect');
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        element.appendChild(ripple);

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

async function loadRipple()
{
    document.querySelectorAll('.ripple').forEach(element => {
        addRippleToElement(element)
    });
}    
