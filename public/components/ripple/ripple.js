
// Inject stylesheet
if (!document.getElementById('ripple-style')) {
    const link = document.createElement('link');
    link.id = 'ripple-style';
    link.rel = 'stylesheet';
    link.href = '/components/ripple/ripple.css';
    document.head.appendChild(link);
}

document.addEventListener('mousedown', (e) => {
    // Find the closest ancestor with class 'ripple' (or self)
    const rippleTarget = e.target.closest('.ripple');
    if (!rippleTarget) return;
    console.log(rippleTarget);

    const ripple = document.createElement('div');

    if (rippleTarget.classList.contains('ripple-dark')) {
        ripple.classList.add('ripple-effect-dark');
    } else {
        ripple.classList.add('ripple-effect-light');
    }

    const rect = rippleTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    let x;
    let y;
    if (rippleTarget.classList.contains('ripple-centered')) {
        x = rect.width / 2 - size / 2;   // Center horizontally
        y = rect.height / 2 - size / 2;  // Center vertically
    } else {
        x = e.clientX - rect.left - size / 2;
        y = e.clientY - rect.top - size / 2;
    }

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    rippleTarget.appendChild(ripple);

    let isMouseUp = false;

    const cleanup = () => {
        ripple.remove();
        rippleTarget.removeEventListener('mouseup', onMouseUp);
        rippleTarget.removeEventListener('mouseleave', onMouseUp);
    };

    const onMouseUp = () => {
        isMouseUp = true;
        ripple.classList.add('fade-out');
        setTimeout(cleanup, 300); // Match the fade-out duration
    };

    rippleTarget.addEventListener('mouseup', onMouseUp);
    rippleTarget.addEventListener('mouseleave', onMouseUp);

    setTimeout(() => {
        if (isMouseUp) onMouseUp();
    }, 1500); // Keep the ripple visible for 600ms
});
// const rect = rippleTarget.getBoundingClientRect();
// const ripple = document.createElement('span');
// ripple.className = 'ripple-effect';

// // Size and position
// const size = Math.max(rect.width, rect.height);
// ripple.style.width = ripple.style.height = size + 'px';
// ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
// ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

// rippleTarget.appendChild(ripple);

// ripple.addEventListener('animationend', () => {
//   ripple.remove();
// });

