async function enableTableHighlights()
{
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        table.addEventListener('click', (e) => {
            const target = e.target;

            if (target.tagName === 'TH') {
                const headers = [...target.parentNode.children];
                let index = 0;
                
                for (let th of headers) {
                    if (th === target) break;
                    index += th.colSpan || 1;
                }

                const isHighlighted = [...table.rows].some(row => 
                    row.cells[index] && row.cells[index].classList.contains('highlight-col')
                );
            
                if (!e.shiftKey) {
                    document.querySelectorAll('.highlight-col').forEach(el => el.classList.remove('highlight-col'));
                }
            
                if (isHighlighted) return;
            
                [...table.rows].forEach(row => {
                    if (row.cells[index] && row.cells[index].tagName !== 'TH') {
                        row.cells[index].classList.add('highlight-col');
                    }
                });
            
                return;
            }
            
            const td = e.target.closest('td');
            if (!td) return;
        
            const isKatexClicked = e.target.closest('.katex');
            if (isKatexClicked) return;

            const row = td.parentElement;
            const isHighlighted = row.classList.contains('highlight-row');

            if (!e.shiftKey) {
                document.querySelectorAll('.highlight-row').forEach(el => el.classList.remove('highlight-row'));
            }
        
            if (!isHighlighted) {
                row.classList.add('highlight-row');
            }
        });
    });
}