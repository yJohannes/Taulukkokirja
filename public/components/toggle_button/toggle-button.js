class ToggleButton extends HTMLButtonElement {
    connectedCallback() {
        this._onSlot = this.querySelector('[slot="on"]');
        this._offSlot = this.querySelector('[slot="off"]');
        this._updateVisibility();

        this.addEventListener('click', this.toggle);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.toggle);
    }

    get toggled() {
        return this.hasAttribute('toggled');
    }

    set toggled(value) {
        if (value) {
            this.setAttribute('toggled', '');
        } else {
            this.removeAttribute('toggled');
        }
        this._updateVisibility();
    }

    toggle = () => {
        this.toggled = !this.toggled;
        this.dispatchEvent(new CustomEvent('toggle-change', {
            detail: { toggled: this.toggled },
            bubbles: true,
            composed: true
        }));
    }

    _updateVisibility() {
        if (this._onSlot) this._onSlot.style.display = this.toggled ? '' : 'none';
        if (this._offSlot) this._offSlot.style.display = this.toggled ? 'none' : '';
        this.setAttribute('aria-pressed', this.toggled ? 'true' : 'false');
    }
}

customElements.define('toggle-button', ToggleButton, { extends: 'button' });
