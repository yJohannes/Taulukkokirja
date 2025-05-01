import { createPopup } from '../components/popup.js';


function initLatex()
{
    const elements = Array.from(document.getElementsByClassName('latex-container'));
    const filtered = elements.filter(element => !element.querySelector('span.katex'));

    filtered.forEach(element => {
        const latex = element.innerText;
        const displayMode = element.classList.contains('display');
        element.setAttribute('title', latex);
        element.setAttribute('data-toggle', 'tooltip');
        element.setAttribute('data-placement', 'right');
        $(element).tooltip({
            delay: { show: 500, hide: 200 },
            animation: true,
            trigger: 'hover'  // No persisting tooltips
        });
        
        katex.render(latex, element, {
            displayMode: displayMode,
            throwOnError: false
        });
        
        const [katex_span] = element.getElementsByClassName('katex');
        katex_span.addEventListener('click', () => {
            katex_span.classList.add('highlight');
            setTimeout(() => katex_span.classList.remove('highlight'), 750);
            
            let latex = element.getAttribute('title');
            if (!latex) {
                latex = element.getAttribute('data-original-title');    
            }
            
            if (!latex) return;
            
            navigator.clipboard.writeText(latex)
            .then(() => {
                createPopup("Copied!", 'success');
            })
            .catch(err => {
                console.error('Error copying text: ', err);
            });
        });
    });
}

export {
    initLatex,
};