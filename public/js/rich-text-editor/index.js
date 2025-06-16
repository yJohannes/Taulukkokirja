export const editor = {
    init,
}

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
    }
    
    window.makeRichText(baseOpts)
}