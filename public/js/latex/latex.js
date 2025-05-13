import { createPopup } from '../components/common/popup.js';
import { addToolTip } from '../components/common/tooltip.js';

function getLatex(element) {
    return element.getAttribute('title') || element.getAttribute('data-original-title');
}

function addClickListener(element, latex) {
    const katex_span = element.querySelector('.katex');
    katex_span.addEventListener('click', () => {
        katex_span.classList.add('highlight');
        setTimeout(() => katex_span.classList.remove('highlight'), 750);

        if (!latex) return;
        
        navigator.clipboard.writeText(latex)
        .then(() => {
            createPopup("Copied!", 'success');
        })
        .catch(err => {
            console.error('Error copying text: ', err);
        });
    });
}

function initLatex()
{
    const elements = Array.from(document.getElementsByClassName('latex-container'));
    const filtered = elements.filter(element => !element.querySelector('span.katex'));
    const prerendered = elements.filter(element => element.querySelector('span.katex'));

    filtered.forEach(element => {
        const latex = element.innerText;
        const displayMode = element.classList.contains('display');
        
        katex.render(latex, element, {
            displayMode: displayMode,
            throwOnError: false
        });
        
        addToolTip(element, 'right', latex);
        addClickListener(element, latex);

    });

    prerendered.forEach(element => {
        const latex = getLatex(element);

        addToolTip(element, 'right', latex);
        addClickListener(element, latex);
    });
}

export {
    initLatex,
};