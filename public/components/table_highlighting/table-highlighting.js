function setupGlobalTableHighlights() {
  document.body.addEventListener('click', (e) => {
    const $target = e.target;
    const $table = $target.closest('table');
    if (!$table) return;

    // COLUMN HIGHLIGHT (on TH click)
    if ($target.tagName === 'TH' || $target.parentElement.tagName === 'TH') {
      let $targetTh = $target.tagName === 'TH' ? $target : $target.parentElement;

      let index = 0;
      const $headers = [...$targetTh.parentNode.children];
      for (let $th of $headers) {
        if ($th === $targetTh) break;
        index += $th.colSpan || 1;
      }

      const isHighlighted = [...$table.rows].some(row =>
        row.cells[index] && row.cells[index].classList.contains('highlight-col')
      );

      if (!e.shiftKey) {
        document.querySelectorAll('.highlight-col').forEach($el =>
          $el.classList.remove('highlight-col')
        );
      }

      if (isHighlighted) return;

      [...$table.rows].forEach(row => {
        if (row.cells[index] && row.cells[index].tagName !== 'TH') {
          row.cells[index].classList.add('highlight-col');
        }
      });

      return;
    }

    // ROW HIGHLIGHT (on TD click)
    const $td = $target.closest('td');
    if (!$td) return;

    if ($target.closest('.katex')) return;

    const row = $td.parentElement;
    const isHighlighted = row.classList.contains('highlight-row');

    if (!e.shiftKey) {
      document.querySelectorAll('.highlight-row').forEach($el =>
        $el.classList.remove('highlight-row')
      );
    }

    if (!isHighlighted) {
      row.classList.add('highlight-row');
    }
  });
}

setupGlobalTableHighlights();