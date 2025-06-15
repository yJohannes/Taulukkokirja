function applyIconPosition($element) {
    Object.assign($element.style, {
        position: 'absolute',
        top: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translateY(-50%)',
    });
}

export function createSearchBar({ placeholder = 'Search...', onInput, classList, buttonClassList } = {}) {
    const $wrapper = document.createElement('div');
    $wrapper.style.position = 'relative';

    const $input = document.createElement('input');
    $input.type = 'search';
    $input.autocomplete = 'off';
    $input.placeholder = placeholder;
    $input.classList = classList;
    $input.ariaLabel = 'Search bar';

    Object.assign($input.style, {
        paddingRight: '3.5rem',
        paddingTop: '0.6rem',
        paddingBottom: '0.6rem',
    })

    const xmlns = "http://www.w3.org/2000/svg";

    const $searchIcon = document.createElementNS(xmlns, "svg");
    applyIconPosition($searchIcon);
    Object.assign($searchIcon.style, {
        right: '1rem',
        pointerEvents: 'none',
    })

    $searchIcon.setAttribute("xmlns", xmlns);
    $searchIcon.setAttribute("width", "16");
    $searchIcon.setAttribute("height", "16");
    $searchIcon.setAttribute("fill", "currentColor");
    $searchIcon.setAttribute("viewBox", "0 0 16 16");
    $searchIcon.setAttribute("class", "bi bi-search");
    {
        const $path = document.createElementNS(xmlns, "path");
        $path.setAttribute("d", "M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0");

        $searchIcon.appendChild($path);
    }


    const $clearIcon = document.createElementNS(xmlns, "svg");
    applyIconPosition($clearIcon);
    Object.assign($clearIcon, {
        right: '0.5rem',
        padding: '0.5rem',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        visibility: 'hidden',
    })

    const $clearBtn = document.createElement('button');
    $clearBtn.classList = buttonClassList;

    $clearIcon.setAttribute("xmlns", xmlns);
    $clearIcon.setAttribute("width", "16");
    $clearIcon.setAttribute("height", "16");
    $clearIcon.setAttribute("fill", "currentColor");
    $clearIcon.setAttribute("viewBox", "0 0 16 16");
    $clearIcon.setAttribute("class", "bi bi-x-lg");
    {
        const $path = document.createElementNS(xmlns, "path");
        $path.setAttribute("d", "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z");

        $clearIcon.appendChild($path);
    }

    $clearBtn.appendChild($clearIcon);

    /* 
    form-control
    btn rounded-circle ripple ripple-dark ripple-centered hover-glow
    */
    $input.addEventListener('input', (e) => {
        if (e.target.value <= 0) {
            this.searchIcon.style.visibility = 'visible';
            this.clearBtn.style.visibility = 'hidden';
        } else {
            this.searchIcon.style.visibility = 'hidden';
            this.clearBtn.style.visibility = 'visible';
        }
        onInput?.($input.value);
    });

    $clearBtn.addEventListener('click', () => {
        $input.value = '';
        $input.focus();
        $input.dispatchEvent(new Event('input', {
            detail: $input.value,
            bubbles: true,
            composed: true,
        }));
    });

}