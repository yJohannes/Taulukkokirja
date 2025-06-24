export const SearchBar = {
    makeSearchBar,
    clearSearchBar,
};

function makeSearchBar(input) {
    if (!(input instanceof HTMLInputElement)) {
        throw new Error("Parameter must be an input element");
    }

    // Inject stylesheet once
    if (!document.getElementById('search-bar-style')) {
        const link = document.createElement('link');
        link.id = 'search-bar-style';
        link.rel = 'stylesheet';
        link.href = './components/search_bar/search-bar.css';
        document.head.appendChild(link);
    }

    // Wrap the input in a div.wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add('search-bar-wrapper');
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    // Set input classes and attributes (optional, based on your original)
    input.classList.add('search-bar');
    input.setAttribute('aria-label', 'Search');

    // Create search icon SVG
    const searchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    searchIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    searchIcon.setAttribute('viewBox', '0 0 16 16');
    searchIcon.setAttribute('fill', 'currentColor');
    searchIcon.classList.add('bi', 'bi-search', 'search-bar-search-icon');
    searchIcon.style.width = '1rem';
    searchIcon.style.height = '1rem';
    searchIcon.innerHTML = `
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
    `;
    wrapper.appendChild(searchIcon);

    // Create clear button
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.classList.add('search-bar-clear-button', 'btn', 'rounded-circle', 'ripple', 'ripple-dark', 'ripple-centered', 'hover-glow');
    clearBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" style="width: 1rem; height: 1rem;" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
        </svg>
    `;
    wrapper.appendChild(clearBtn);

    clearBtn.classList.add('hidden');

    // Input event to toggle clear button and search icon
    input.addEventListener('input', (e) => {
        if (input.value.length > 0) {
            searchIcon.classList.add('hidden');
            clearBtn.classList.remove('hidden');
        } else {
            searchIcon.classList.remove('hidden');
            clearBtn.classList.add('hidden');
        }
    });

    // Clear button clears input and focuses
    clearBtn.addEventListener('click', () => {
        input.value = '';
        input.focus();
        input.dispatchEvent(new Event('input', {
            bubbles: true,
            composed: true,
        }));
    });

    // Return helper object
    return {
        get value() {
            return input.value;
        },
        set value(val) {
            input.value = val;
            if (val.length > 0) {
                searchIcon.classList.add('hidden');
                clearBtn.classList.remove('hidden');
            } else {
                searchIcon.classList.remove('hidden');
                clearBtn.classList.add('hidden');
            }
        },
        input,
        clearBtn,
        searchIcon,
        wrapper,
    };
}

function clearSearchBar(input) {
    input.value = '';
}

// export class SearchBar extends HTMLElement {
//     constructor() {
//         super();

//         // Inject stylesheet
//         if (!document.getElementById('search-bar-style')) {
//             const link = document.createElement('link');
//             link.id = 'search-bar-style';
//             link.rel = 'stylesheet';
//             link.href = './components/search_bar/search-bar.css';
//             document.head.appendChild(link);
//         }

//         this.innerHTML = `
//             <div class="search-bar-wrapper">
//                 <input type="text" autocomplete="off" class="search-bar form-control" placeholder="Hae... " aria-label="Search"></input>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search search-bar-search-icon" viewBox="0 0 16 16">
//                     <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
//                 </svg>
//                 <button class="search-bar-clear-button btn rounded-circle ripple ripple-dark ripple-centered hover-glow">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
//                         <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
//                     </svg>
//                 </button>
//             </div>
//         `;

//         this.input = this.querySelector('input');
//         this.clearBtn = this.querySelector('.search-bar-clear-button');
//         this.searchIcon = this.querySelector('.search-bar-search-icon');

//         // Clear input on clicking clear button
//         this.clearBtn.addEventListener('click', () => {
//             this.input.value = '';
//             this.input.focus();
//             this.input.dispatchEvent(new Event('input', {
//                 detail: this.input.value,
//                 bubbles: true,
//                 composed: true,
//             }));
//         });
//         this.clearBtn.classList.add('hidden');

//         // Show/hide clear button on input
//         this.input.addEventListener('input', (e) => {
//             if (e.target.value.length > 0) {
//                 this.searchIcon.classList.add('hidden');
//                 this.clearBtn.classList.remove('hidden');
//             } else {
//                 this.searchIcon.classList.remove('hidden');
//                 this.clearBtn.classList.add('hidden');
//             }
//         });
//     }

//     get value() {
//         return this.input.value;
//     }

//     set value(val) {
//         this.input.value = val;
//         this.clearBtn.style.display = val ? 'block' : 'none';
//     }
// }

// customElements.define('search-bar', SearchBar);