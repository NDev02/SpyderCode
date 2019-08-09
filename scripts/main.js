
let application = {
    defaultOptions: {
        language: 'javascript',
        lineNumbers: 'on',
        theme: "vs-dark",
        automaticLayout: true
    },
    openEditors: {},
    currentTheme: {}
};

window.addEventListener("load", e => {
    // Gets the container to place the editor
    let editorPane = document.querySelector(`#editor-pane`);

    // Configures the editor source path
    require.config({ paths: { 'vs': 'libraries/monaco/min/vs' }});
    
    // Creates the editor
    createEditor(editorPane, "test-editor", application.defaultOptions);
});

window.addEventListener("resize", e => {
    // Reload the layouts of each editor
    for(let id of Object.keys(application.openEditors)) {
        let editor = application.openEditors[id];
        editor.layout({w: editor.getDomNode().offsetWidth, h: editor.getDomNode.offsetHeight});
    }
});

function createEditor(container, id, options) {
    // Fetches the required files for creating the editor then creates it
    require(['vs/editor/editor.main'], function() {
        // Loads the themes
        defineThemes();

        // Creates an instance of the editor
        let editor = monaco.editor.create(container, options);

        // Makes the theme information easily accesible to the application
        application.currentTheme = editor._themeService.getTheme().colors;
        updateTheme();

        // Saves the open editor
        application.openEditors[id] = editor;
    });
}

function setTheme(themeName) {
    monaco.editor.setTheme(themeName);
    application.currentTheme = application.openEditors[Object.keys(application.openEditors)[0]]._themeService.getTheme().colors;
    updateTheme();
}

function updateTheme() {
    // Saves theme information to the style sheet for the application
    document.querySelector(":root").style.setProperty("--bg", application.currentTheme["editor.background"].toString());
    document.querySelector(":root").style.setProperty("--fg", application.currentTheme["editor.foreground"].toString());
}

function defineThemes() {
    // Registers some other themes
    fetch("./themes/themelist.json").then(res => res.json()).then(list => {
        for(let theme of Object.keys(list)) {
            let name = `${list[theme]}.json`;
            fetch(`./themes/${name}`).then(res => res.json()).then(data => {
                data["rules"].push( { token: '', background: data["colors"]["editor.background"] } );
                monaco.editor.defineTheme(theme, data);
            });
        }
    });
}