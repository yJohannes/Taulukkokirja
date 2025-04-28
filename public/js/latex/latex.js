import { createPopup } from '../components/popup.js';

function initLatexWorkersFast() {
    const elements = Array.from(document.getElementsByClassName('latex-container'));
    let idCounter = 0;
    const pending = new Map();

    // Number of workers equal to available CPU cores (default to 4)
    const WORKER_COUNT = navigator.hardwareConcurrency || 4;
    const workers = Array.from({ length: WORKER_COUNT }).map(() => {
        const workerCode = `
            self.importScripts('https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js');
            self.onmessage = function (e) {
                const { latex, displayMode, id } = e.data;
                try {
                    const html = katex.renderToString(latex, {
                        displayMode,
                        throwOnError: false
                    });
                    self.postMessage({ id, html });
                } catch (err) {
                    self.postMessage({ id, error: err.message });
                }
            };
        `;
        const blob = new Blob([workerCode], { type: "application/javascript" });
        return new Worker(URL.createObjectURL(blob));
    });

    // Worker response handler
    workers.forEach(worker => {
        worker.onmessage = (e) => {
            const { id, html, error } = e.data;
            const el = pending.get(id);
            if (!el) return;
            pending.delete(id);

            if (error) {
                el.innerHTML = `<span style="color: red;">Error: ${error}</span>`;
            } else {
                el.innerHTML = html;

                const [katex_span] = el.getElementsByClassName('katex');
                katex_span?.addEventListener('click', async () => {
                    katex_span.classList.add('highlight');
                    setTimeout(() => katex_span.classList.remove('highlight'), 750);

                    const latex = el.getAttribute('title') || el.getAttribute('data-original-title');
                    if (!latex) return;

                    try {
                        await navigator.clipboard.writeText(latex);
                        createPopup("Copied!", 'success');
                    } catch (err) {
                        console.error('Error copying text: ', err);
                    }
                });
            }
        };
    });

    let queueIndex = 0;

    // Function to schedule rendering of batches of elements
    function scheduleNext() {
        if (queueIndex >= elements.length) return;

        // Split into batches for each frame
        const batchSize = Math.ceil(elements.length / WORKER_COUNT);
        const currentBatch = elements.slice(queueIndex, queueIndex + batchSize);
        queueIndex += batchSize;

        // Dispatch each batch to workers
        currentBatch.forEach(el => {
            const latex = el.textContent; // Use textContent for speed
            const displayMode = el.classList.contains('display');

            el.setAttribute('title', latex);
            el.setAttribute('data-toggle', 'tooltip');
            el.setAttribute('data-placement', 'right');

            $(el).tooltip({
                delay: { show: 500, hide: 200 },
                animation: true,
                trigger: 'hover'
            });

            const id = idCounter++;
            pending.set(id, el);

            const worker = workers[id % workers.length]; // Round-robin worker allocation
            worker.postMessage({ id, latex, displayMode });
        });

        requestAnimationFrame(scheduleNext); // Continue rendering in the next frame
    }

    scheduleNext(); // Start rendering
}



function initLatexWorkers() {
    const elements = Array.from(document.getElementsByClassName('latex-container'));
    let idCounter = 0;
    const pending = new Map();

    // Inline Web Worker via Blob
    const workerCode = `
        self.importScripts('https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js');
        self.onmessage = function (e) {
            const { latex, displayMode, id } = e.data;
            try {
                const html = katex.renderToString(latex, {
                    displayMode,
                    throwOnError: false
                });
                self.postMessage({ id, html });
            } catch (err) {
                self.postMessage({ id, error: err.message });
            }
        };
    `;
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));

    // Handle responses from the worker
    worker.onmessage = (e) => {
        const { id, html, error } = e.data;
        const el = pending.get(id);
        if (!el) return;
        pending.delete(id);

        if (error) {
            el.innerHTML = `<span style="color: red;">Error: ${error}</span>`;
        } else {
            el.innerHTML = html;

            const [katex_span] = el.getElementsByClassName('katex');
            katex_span?.addEventListener('click', async () => {
                katex_span.classList.add('highlight');
                setTimeout(() => katex_span.classList.remove('highlight'), 750);

                const latex = el.getAttribute('title') || el.getAttribute('data-original-title');
                if (!latex) return;

                try {
                    await navigator.clipboard.writeText(latex);
                    createPopup("Copied!", 'success');
                } catch (err) {
                    console.error('Error copying text: ', err);
                }
            });
        }
    };

    // Queue rendering for each LaTeX element
    for (const el of elements) {
        const latex = el.innerText;
        const displayMode = el.classList.contains('display');

        el.setAttribute('title', latex);
        el.setAttribute('data-toggle', 'tooltip');
        el.setAttribute('data-placement', 'right');

        $(el).tooltip({
            delay: { show: 500, hide: 200 },
            animation: true,
            trigger: 'hover'
        });

        const id = idCounter++;
        pending.set(id, el);
        worker.postMessage({ id, latex, displayMode });
    }
}

async function initLatex()
{
    const elements = document.getElementsByClassName('latex-container');

    Array.from(elements).forEach(element => {
        requestIdleCallback(() => {
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
            katex_span.addEventListener('click', async function() {
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
    });
}

export {
    initLatex,
    initLatexWorkers,
    initLatexWorkersFast
};