// Escape special characters in the search term for regex
function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function highlightTerms(element, terms) {
    // Sort by length so all words get properly highlighted
    terms = [...terms].sort((a, b) => b.length - a.length);

    const regex = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

    const nodesToProcess = [];

    // Collect nodes first to avoid modifying DOM while traversing
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (regex.test(node.nodeValue)) {
            nodesToProcess.push(node);
        }
    }

    for (const textNode of nodesToProcess) {
        const parent = textNode.parentNode;
        const frag = document.createDocumentFragment();
        const parts = textNode.nodeValue.split(regex);

        for (const part of parts) {
            if (regex.test(part)) {
                const mark = document.createElement('mark');
                mark.textContent = part;
                frag.appendChild(mark);
            } else {
                frag.appendChild(document.createTextNode(part));
            }
        }

        parent.replaceChild(frag, textNode);
    }
}