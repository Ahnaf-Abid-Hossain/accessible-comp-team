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

        let decorations = [];
        let decorations2 = [];
        
        const disposable2 = vscode.workspace.onDidChangeTextDocument(event => {

            if (event.document === editor.document) {
                const changes = event.contentChanges;
                changes.forEach(change => {
                    if (change.text.includes('\n')) {
                        const line = editor.document.lineAt(change.range.start.line).text;
                        if (line.includes("peep")) {
                            const line = change.range.start.line;
                            const startPosition = new vscode.Position(line, 0);
                            const endPosition = new vscode.Position(line, editor.document.lineAt(line).text.length);
                            const decoration = { range: new vscode.Range(startPosition, endPosition) };
                            decorations.push(decoration);
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
                    }
                });
            }
            console.log(decorations2.length);
            editor.setDecorations(decorationType, decorations);
            editor.setDecorations(decorationTypeError, decorations2);
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
