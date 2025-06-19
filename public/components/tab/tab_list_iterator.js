export class TabListIterator {
    constructor(rootSelector) {
        const explorer = document.querySelector(rootSelector);
        this.tabs = Array.from(explorer.querySelectorAll('.tab'));
        this.index = 0;
    }

    next() {
        if (this.index < this.tabs.length) {
            return { value: this.tabs[this.index++], done: false };
        } else {
            return { done: true };
        }
    }

    reset() {
        this.index = 0;
    }

    [Symbol.iterator]() {
        return {
            next: () => this.next()
        };
    }
}
