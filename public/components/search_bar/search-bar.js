export class SearchBar extends HTMLElement {
    constructor() {
        super();

        // Inject stylesheet
        if (!document.getElementById('search-bar-style')) {
            const link = document.createElement('link');
            link.id = 'search-bar-style';
            link.rel = 'stylesheet';
            link.href = './components/search_bar/search-bar.css';
            document.head.appendChild(link);
        }

        // <i class="bi bi-search search-bar-search-icon"></i>
        this.innerHTML = `
            <div class="search-bar-wrapper">
                <input type="text" autocomplete="off" class="search-bar form-control" placeholder="Hae... " aria-label="Search"></input>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search search-bar-search-icon" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <button class="search-bar-clear-button btn rounded-circle ripple ripple-dark ripple-centered hover-glow"">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </button>
            </div>
        `;

        this.input = this.querySelector('input');
        this.clearBtn = this.querySelector('.search-bar-clear-button');
        this.searchIcon = this.querySelector('.search-bar-search-icon');

        // Clear input on clicking clear button
        this.clearBtn.addEventListener('click', () => {
            this.input.value = '';
            this.input.focus();
            this.input.dispatchEvent(new Event('input', {
                detail: this.input.value,
                bubbles: true,
                composed: true,
            }));
        });

        // Show/hide clear button on input
        this.input.addEventListener('input', (e) => {
            if (e.target.value <= 0) {
                this.searchIcon.style.visibility = 'visible';
                this.clearBtn.style.visibility = 'hidden';
            } else {
                this.searchIcon.style.visibility = 'hidden';
                this.clearBtn.style.visibility = 'visible';
            }
        });
    }

    get value() {
        return this.input.value;
    }

    set value(val) {
        this.input.value = val;
        this.clearBtn.style.display = val ? 'block' : 'none';
    }
}

// Register custom element
customElements.define('search-bar', SearchBar);