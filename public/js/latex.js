async function initLatex()
{
    const elements = document.getElementsByClassName('latex-container');

    Array.from(elements).forEach(element => {
        const latex = element.innerText;
        const displayMode = element.classList.contains('display');
        element.setAttribute('title', latex);
        element.setAttribute('data-toggle', 'tooltip');
        element.setAttribute('data-placement', 'right');
        $(element).tooltip({
            delay: { show: 500, hide: 200 },
            animation: true
        });

        katex.render(latex, element, {
            displayMode: displayMode,
            throwOnError: false
        });

        const [katex_span] = element.getElementsByClassName('katex');
        katex_span.addEventListener('click', async function() {
            katex_span.classList.add('highlight');
            setTimeout(() => katex_span.classList.remove('highlight'), 750);

            const latex = element.getAttribute('title');

            if (!latex) return;

            navigator.clipboard.writeText(latex)
                .then(() => {
                    showPopup("Copied!");
                })
                .catch(err => {
                    console.error('Error copying text: ', err);
                });
        });

    });
}

export { initLatex };