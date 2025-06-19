export const Editor = {
    init,
};

function init() {
    const baseOpts = {
        baseUrl: 'http://localhost:5500',
        initialValue: '',
            // 'testi. <br>kaava: <img src="http://localhost:5500/math.svg?latex=%5Csqrt%7B123%7D" alt="\\sqrt{123}"><br> <br>',
        textAreaProps: {
            ariaLabelledBy: 'question-label',
            questionId: '123',
            editorStyle: {},
            lang: 'fi-FI',
        },
        // onValueChange: console.log
    };
    
    window.makeRichText(baseOpts);

    // const editor = document.querySelector('.rich-text-editor');
    // console.log(editor)
    // editor.addEventListener('keydown', e => {
    //     if (e.key === 'Escape') {
    //         editor.blur();
    //         console.log("EDSCAPED")
    //     }
    // });
}