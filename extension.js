const vscode = require('vscode');

class MyHoverProvider {
    provideHover(document, position, token) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return null;
        }

        const decorations = editor.visibleRanges.flatMap(range => {
            return editor.decorations.map(decoration => {
                if (decoration.range.contains(position)) {
                    return decoration.options;
                }
            }).filter(Boolean);
        });

        for (const decoration of decorations) {
            if (decoration.hoverMessage) {
                return new vscode.Hover(decoration.hoverMessage);
            }
        }

        return null;
    }
}

function checkHeadings(nums) {
    let highestLevel = 0;
    for (const num of nums) {
        if (num === highestLevel + 1) {
            highestLevel = num;
        } else if (num <= highestLevel) {
            continue;
        } else {
            return false;
        }
    }
    return true;
}

function extractHeadingLevel(str) {
    const match = str.match(/<h(\d+)/);
    if (match && match[1]) {
        return parseInt(match[1]);
    } else {
        return null; // No match found
    }
}

function activate(context) {
    console.log('Congratulations, your extension "accessible-comp" is now active!');
    let headingLevels = [];
    let hasInputLabel = false;

    let disposable = vscode.commands.registerCommand('accessible-comp.helloWorld', function () {
        vscode.window.showInformationMessage('Hello World from accessible-comp!');
    });

    vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor);

    let disposable3 = vscode.commands.registerCommand('accessible-comp.trackCodeChanges', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found.');
            return;
        }

        const decorationType = vscode.window.createTextEditorDecorationType({
            textDecoration: 'underline solid green'
        });

        const decorationTypeError = vscode.window.createTextEditorDecorationType({
            textDecoration: 'underline solid red',
        });

        const decorationTypeWarning = vscode.window.createTextEditorDecorationType({
            textDecoration: 'underline solid yellow',
        });

        let decorations = [];
        let decorations2 = [];
        let decorations3 = [];
        let errorList = [];

        function removeDecorationByLineNumber(lineNumberToRemove, decorationsList) {
            // Filter out decorations with the specified line number
            decorationsList.filter(decoration => decoration.range.start.line !== lineNumberToRemove);
        }

        const disposable2 = vscode.workspace.onDidChangeTextDocument(event => {
           
            if (event.document === editor.document) {

                const changes = event.contentChanges;

                changes.forEach(change => {
                    if (change.text.includes('\n')) {
                        
                        const line = editor.document.lineAt(change.range.start.line).text;
                        line2 = change.range.start.line
                        console.log("print start: ",decorations2)
                        for (const error of errorList) {
                            // console.log("test")
                            // console.log(error)
                            // console.log("line ",line2)
                            // console.log("error mark ",error[0])
                            // console.log("dec:",decorations2)
                            if (error[0] === line2) {
                                // return error; // Return the error object if the line number matches the target
                                errortype = error[1]
                                // console.log("here")
                                if (errortype === "img"){
                                    console.log("here2")
                                    if (line.includes("alt=")) {
                                        // decorations2 = [];
                                        console.log("jjj")
                                        for (const dec in decorations2){
                                            console.log('looking for line: ',line2)
                                            console.log("error lines: ", decorations2[dec].range.c.c)
                                            if(decorations2[dec].range.c.c === line2){
                                                console.log("foindes")
                                                console.log("before ",decorations2)
                                                decorations2.splice(dec,1);
                                                console.log("after",decorations2)
                                                // break;
                                            }
                                            // else{
                                            //     console.log("opdss")
                                            //     decorations2[dec].range.c.c = decorations2[dec].range.c.c+1
                                            // }
                                        }
                                        // for (const dec in decorations2){
                                        //     console.log("hs")
                                        //     console.log("djskds",decorations2[dec].range.c.c.m)
                                        //     console.log("e value", decorations2[dec].range.c.e)
                                        //     decorations2[dec].range.c.c = decorations2[dec].range.c.c+1
                                        //     console.log("djskds2",decorations2[dec].range.c.c.m)
                                        //     console.log("e value", decorations2[dec].range.c.e)
                                            
                                        // }
                                        // decorations2 = removeDecorationByLineNumber(decorations2,line2)
                                        editor.setDecorations(decorationTypeError,decorations2);
                                        
                                    }
                                }
                                // else if(errortype === "nav"){

                                // }
                            }
                        }
                        if (line.includes("peep")) {
                            const line = change.range.start.line;
                            const startPosition = new vscode.Position(line, 0);
                            const endPosition = new vscode.Position(line, editor.document.lineAt(line).text.length);
                            const decoration = { range: new vscode.Range(startPosition, endPosition) };
                            decorations.push(decoration);
                        }
                        if (line.includes("<label") && line.includes(">")) {
                            hasInputLabel = true;
                        }
                        if (line.includes("<h") && line.includes(">")) {
                            let level = extractHeadingLevel(line);
                            headingLevels.push(+level);
                            if (!checkHeadings(headingLevels)) {
                                const line = change.range.start.line;
                                const startPosition = new vscode.Position(line, 0);
                                const endPosition = new vscode.Position(line, editor.document.lineAt(line).text.length);
                                const decoration3 = { range: new vscode.Range(startPosition, endPosition), hoverMessage: {
                                    language: 'markdown',
                                    value: `**Incorrect Heading Hiearchy**

You are trying to add a H${level}, but ${headingLevels.slice(0,-1).length ? `your highest level is H${Math.max(...headingLevels.slice(0,-1))}` : "you don't even have an H1"}. You are missing heading levels between these two headings.

An incorrect heading hiearchy makes it extremely difficult for screen readers. Please fix this.`
                                } };
                                decorations2.push(decoration3);
                            }
                        }
                        if (line.includes("<img") && line.includes(">")) {
                            if (!line.includes("alt=")) {
                                const line = change.range.start.line;
                                console.log("co: ", line)
                                errorList.push([line , "img"]);
                                const startPosition = new vscode.Position(line, 0);
                                const endPosition = new vscode.Position(line, editor.document.lineAt(line).text.length);
                                const decoration2 = { range: new vscode.Range(startPosition, endPosition), hoverMessage: {
                                    language: 'markdown',
                                    value: `**Alt text missing!**

Adding alt text to images is crucial for web accessibility. Alt text provides a textual description of the image content, making it accessible to people who use screen readers or have images disabled in their browsers. Without alt text, users with disabilities may not be able to understand the purpose or content of the image.

Make sure to add descriptive alt text that conveys the meaning or function of the image to ensure your website is accessible to all users.`
                                } };
                                decorations2.push(decoration2);
                            }
                        }
                        if (line.includes("<input") && line.includes(">")) {
                            if (!hasInputLabel) {
                                const line = change.range.start.line;
                                const startPosition = new vscode.Position(line, 0);
                                const endPosition = new vscode.Position(line, editor.document.lineAt(line).text.length);
                                const decoration2 = { range: new vscode.Range(startPosition, endPosition), hoverMessage: {
                                    language: 'markdown',
                                    value: `**Missing Form Input Label!**

Adding form input labels is crucial for web accessibility. Input labels provides a textual description of the input, making it accessible to people who use screen readers. Without them, users with disabilities may not be able to understand the purpose or content of the input.

Adding labels will make it easier for all users, including those who rely on screen readers, to understand the form`
                                } };
                                decorations2.push(decoration2);
                            }
                        }
                        if (line.includes("tabindex")) {
                            const line = change.range.start.line;
                            const startPosition = new vscode.Position(line, 0);
                            const endPosition = new vscode.Position(line, editor.document.lineAt(line).text.length);
                            const decoration3 = { range: new vscode.Range(startPosition, endPosition), hoverMessage: {
                                language: 'markdown',
                                value: `**Warning: Manually setting the tabindex may be problematic!**

Manually setting a tabindex value can be problmeatic for keyboard users because it may cause issues with the default HTML document flow. 

It is generally recommended to avoid using tabindex unless there's a very specific need to overide the default tab order.`
                            } };
                            decorations3.push(decoration3);
                        }
                        if (line.includes("<button>") || line.includes("<a") || line.includes("<nav")) {
                            if (!line.includes("role=")) {
                                const line = change.range.start.line;
                                const startPosition = new vscode.Position(line, 0);
                                const endPosition = new vscode.Position(line, editor.document.lineAt(line).text.length);
                                const decoration2 = { range: new vscode.Range(startPosition, endPosition), hoverMessage: {
                                    language: 'markdown',
                                    value: `**Missing role attribute for corresponding element!**

ARIA (Accessible Rich Internet Applications) is used to enhance the accessibility of web content by providing additional semantics and context for assistive technologies like screen readers. 

Adding ARIA roles and attributes helps ensure that users with disabilities can navigate and interact with web pages more effectively.`
                                } };
                                decorations2.push(decoration2);
                            }
                        }
                    }
                });
            }
            console.log(decorations2.length);
            editor.setDecorations(decorationType, decorations);
            editor.setDecorations(decorationTypeError, decorations2);
            editor.setDecorations(decorationTypeWarning, decorations3);
        });

        context.subscriptions.push(decorationType, disposable2);

        const hoverProvider = new MyHoverProvider();
        context.subscriptions.push(
            vscode.languages.registerHoverProvider(
                { scheme: 'file', language: 'html' },
                hoverProvider
            )
        );
    });

    context.subscriptions.push(disposable, disposable3);
}

function deactivate() {}

function onDidChangeActiveTextEditor(editor) {
    console.log('Active Text Editor:', editor);
    if (editor) {
        const document = editor.document;
        const languageId = document.languageId;
        const fileExtension = document.fileName.split('.').pop();
        console.log('Language Identifier:', languageId);
        console.log('File Extension:', fileExtension);
    }
}

module.exports = {
    activate,
    deactivate
}
