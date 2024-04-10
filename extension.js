// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "accessible-comp" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('accessible-comp.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from accessible-comp!');
	});

	vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor);


    // changes for live tracking code


	let disposable3 = vscode.commands.registerCommand('accessible-comp.trackCodeChanges', () => {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found.');
            return;
        }
        //getting file name for the working file
		const fileName = editor.document.fileName;
        //creating deco object
        const decorationType = vscode.window.createTextEditorDecorationType({
            textDecoration: 'underline solid green'
        });
        const decorationTypeError = vscode.window.createTextEditorDecorationType({
            textDecoration: 'underline solid red'
        });

        // Subscribe to changes in the text editor
        const disposable2 = vscode.workspace.onDidChangeTextDocument(event => {
            let decorations = [];
            let decorations2 = []
            if (event.document === editor.document) {
                //changes are the changes string
                const changes = event.contentChanges;
                changes.forEach(change => {
                    // Check if Enter key was pressed
                    if (change.text.includes('\n')) {
                        const line = editor.document.lineAt(change.range.start.line).text;
                        console.log(`Code Change in ${fileName}:`);
                        console.log(line);
                        if (line.includes("peep")){
                            console.log("opop");
                            const line = change.range.start.line;
                            const startPosition = new vscode.Position(line, 0);
                            const endPosition = new vscode.Position(line, editor.document.lineAt(line).text.length);
                            const decoration = { range: new vscode.Range(startPosition, endPosition) };
                            decorations.push(decoration);
                        }
                        if(line.includes("<img") && line.includes(">")){
                            console.log("fill img tag");
                            if(line.includes ("alt=")){
                                console.log(" we good");

                            }else{
                                console.log("we bad");
                                const line = change.range.start.line;
                                const startPosition = new vscode.Position(line, 0);
                                const endPosition = new vscode.Position(line, editor.document.lineAt(line).text.length);
                                const decoration2 = { range: new vscode.Range(startPosition, endPosition) };
                                decorations2.push(decoration2);
                                
                            }
                        }
        
                    }
                    
                });
                editor.setDecorations(decorationType, decorations);
                editor.setDecorations(decorationTypeError, decorations2);
            }
        });

        // Dispose the subscription when necessary
        context.subscriptions.push(decorationType, disposable2);
    });



	context.subscriptions.push(disposable3);
}

// This method is called when your extension is deactivated
function deactivate() {}

function onDidChangeActiveTextEditor(editor) {
	console.log('Active Text Editor:', editor);
    if (editor) {
        const document = editor.document;

        // Get the language identifier of the document
        const languageId = document.languageId;

        // Get the file extension of the document
        const fileExtension = document.fileName.split('.').pop();

        console.log('Language Identifier:', languageId);
        console.log('File Extension:', fileExtension);
    }
}


module.exports = {
	activate,
	deactivate
}
