import { createPopup } from '../components/common/popup.js';
import { addToolTip } from '../components/common/tooltip.js';

function getElementLatex($element) {
    return $element.getAttribute('title') || $element.getAttribute('data-original-title');
}

function addClickListener($element, latex) {
    $element.addEventListener('click', () => {
        $element.classList.add('highlight');
        setTimeout(() => $element.classList.remove('highlight'), 750);

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

/**
 * Renders LaTeX content in all `latex-container`'s in a given element. 
 */
export function renderElementLatex($element)
{
    const elements = Array.from($element.getElementsByClassName('latex-container'));
    const filtered = elements.filter($el => !$el.querySelector('span.katex'));
    const prerendered = elements.filter($el => $el.querySelector('span.katex'));

    filtered.forEach($el => {
        const latex = $el.innerText;
        const displayMode = $el.classList.contains('full');
        
        katex.render(latex, $el, {
            displayMode: displayMode,
            throwOnError: false
        });
        
        addToolTip($el, 'right', latex);
        addClickListener($el, latex);

    });

    prerendered.forEach($el => {
        const latex = getElementLatex($el);

        addToolTip($el, 'right', latex);
        addClickListener($el, latex);
    });
}