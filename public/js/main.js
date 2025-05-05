import * as explorer from './components/explorer/index.js'

import { initPageLoading } from './components/pages.js';
import { initSidebar } from './layout/sidebar.js';
import { initNavbar } from './layout/navbar.js';
import { loadSettings } from './components/settings.js';
import * as editor from './rich_text_editor/index.js'

import * as poasd from './layout/editor.js'

document.addEventListener('DOMContentLoaded', async () => {
    initPageLoading();
    initNavbar();
    initSidebar();

    await explorer.loadExplorerToElement(document.getElementById('explorer-container'));
    explorer.loadExplorerSave();
    loadSettings();

    editor.init();

    const baseOpts = {
        baseUrl: 'http://localhost:5500',
        initialValue:
            'testi. <br>kaava: <img src="http://localhost:5500/math.svg?latex=%5Csqrt%7B123%7D" alt="\\sqrt{123}"><br> <br>',
        textAreaProps: {
            ariaLabelledBy: 'question-label',
            questionId: '123',
            editorStyle: {},
            lang: 'fi-FI',
        },
        // onValueChange: console.log
    }

    window.makeRichText(baseOpts)

});
