const FADE_OUT_DURATION = 200;
const HOLD_DURATION = 250;

// Inject stylesheet
if (!document.getElementById('ripple-style')) {
    const link = document.createElement('link');
    link.id = 'ripple-style';
    link.rel = 'stylesheet';
    link.href = './components/ripple/ripple.css';
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

    const cleanup = () => {
        ripple.remove();
        rippleTarget.removeEventListener('mouseup', onMouseUp);
        rippleTarget.removeEventListener('mouseleave', onMouseUp);
    };
    
    const onMouseUp = () => {
        setTimeout(() => {
            ripple.classList.add('fade-out');
            setTimeout(cleanup, FADE_OUT_DURATION); // Match the fade-out duration
        }, HOLD_DURATION);
    };

    rippleTarget.addEventListener('mouseup', onMouseUp);
    rippleTarget.addEventListener('mouseleave', onMouseUp);
});