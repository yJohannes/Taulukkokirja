async function initLatex()
{
    const elements = document.getElementsByClassName('latex-container');

    Array.from(elements).forEach(element => { // Convert HTMLCollection to an array
        const latex = element.innerText;
        const displayMode = element.classList.contains('display');
        const alignLeft = element.classList.contains('align-left');

        element.setAttribute('title', latex);
        katex.render(latex, element, {
            displayMode: displayMode,
            throwOnError: false
        });

        const [katex_span] = element.getElementsByClassName('katex');

        if (alignLeft) {
            katex_span.style.textAlign = 'left'
        }

        katex_span.addEventListener('click', async function() {
            katex_span.classList.add('highlight');
            setTimeout(() => katex_span.classList.remove('highlight'), 750);

            const latex = element.getAttribute('title');

            if (!latex) return;

            navigator.clipboard.writeText(latex)
                .then(() => {
                    showPopup("Copied!");  // Show the "Copied!" popup
                })
                .catch(err => {
                    console.error('Error copying text: ', err);
                });
        });
    });
}

export { initLatex };