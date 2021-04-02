'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as svg from "./visualizer";
import * as api from "./api";
import { readFileSync, existsSync } from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let previewUri = vscode.Uri.parse('simpl-visualize://authority/simpl-visualize');

    class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
        
        private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

        public update(uri: vscode.Uri) {
            this._onDidChange.fire(uri);
        }

        public provideTextDocumentContent(uri: vscode.Uri): string {
            return this.createVisualizer();
        }

        private createVisualizer() {
            let editor = vscode.window.activeTextEditor;
            if (editor) {
                if (!(editor.document.languageId === 'simpl+')) {
                    return this.errorSnippet("A SIMPL+ file is not open.");
                }
                else {
                    return this.extractVisualizer();
                }
            }
            else {
                return this.errorSnippet("A SIMPL+ file is not open.");
            }
        }

        private extractVisualizer(): string {
            let parser = new svg.VisualizerParse();
            parser.parseSimplPlus();

            let viewer = new svg.SVGCreator(parser);
            return viewer.returnSVG();
        }

        private errorSnippet(error: string): string {
            return `
				<body>
					${error}
				</body>`;
        }

        get onDidChange(): vscode.Event<vscode.Uri> {
            return this._onDidChange.event;
        }
    }

    let webPanel: vscode.WebviewPanel | undefined = undefined;
    let provider = new TextDocumentContentProvider();
    let registration = vscode.workspace.registerTextDocumentContentProvider('simpl-visualize', provider);

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
        if (vscode.window.activeTextEditor && e.document === vscode.window.activeTextEditor.document) {
            provider.update(previewUri);
            if (webPanel) {
                webPanel.webview.html = provider.provideTextDocumentContent(previewUri);
            }
        }
    });

    vscode.window.onDidChangeTextEditorSelection((e: vscode.TextEditorSelectionChangeEvent) => {
        if (e.textEditor === vscode.window.activeTextEditor) {
            provider.update(previewUri);
            if (webPanel) {
                webPanel.webview.html = provider.provideTextDocumentContent(previewUri);
            }
        }
    });

    let defaultCompile = vscode.commands.registerCommand('extension.simplCC_defaultCompile', () => {
        let targets = "";
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            let ush = editor.document.uri.fsPath.replace(/.usp$/i, ".ush");
            if (existsSync(ush)) {
                let data = readFileSync(ush).toString();
                if (data.length) {
                    let startPos = data.indexOf("Inclusions_CDS=");
                    if (startPos) {
                        let endPos = data.indexOf("\r", startPos);
                        let inclusions = data.substring(startPos, endPos);
                        if (inclusions.includes("5")) {
                            targets += "series2 ";
                        }
                        if (inclusions.includes("6")) {
                            targets += "series3 ";
                        }
                        if (inclusions.includes("7")) {
                            targets += "series4 ";
                        }
                        targets = targets.trim();                    
                    }
                }
            }
        }        
        
        if (!targets.length) {
            targets = vscode.workspace.getConfiguration("simpl").defaultTarget;
            //vscode.window.showInformationMessage(".ush file not found, compiling for default targets: " + targets);                    
        }
        else {
            //vscode.window.showInformationMessage("Compiling for targets specified in .ush file: " + targets);
        }
        
        processSimpl("\\target " + targets);
    });

    let selectTargetAndCompileSingle = vscode.commands.registerCommand('extension.simplCC_selectCompileSingle', async () => {
        let targets = await getTargets();
        if (!targets.length) {
            vscode.window.showWarningMessage("SIMPL+: No target selected, compile operation cancelled.");            
        }
        else {
            processSimpl("\\target " + targets);
        }
    });

    let selectTargetAndCompileMultiple = vscode.commands.registerCommand("extension.simplCC_selectCompileMultiple", async () => {
        let targets = await getTargets();
        if (!targets.length) {
            vscode.window.showWarningMessage("SIMPL+: No target selected, compile operation cancelled.");            
        }
        else {
            let foundFiles = vscode.workspace.findFiles('*.usp');
            let term = vscode.window.createTerminal('simplCC', vscode.workspace.getConfiguration("simpl").terminalLocation);
            let compiler = new SimplCompiler();

            term.show();
            foundFiles.then(files => {
                if (files.length) {
                    files.forEach(e => {
                        compiler.filepaths.push(e.fsPath);
                    });
                    term.sendText(compiler.buildCommand("\\target " + targets));
                } else {
                    vscode.window.showErrorMessage("No .usp files found");
                }
            });
        }
    });

    let simplVisualize = vscode.commands.registerCommand("extension.simpl_visualize", () => {
        if (webPanel) {
            webPanel.reveal();
        }
        else {
            webPanel = vscode.window.createWebviewPanel(
                previewUri.toString(),
                "SIMPL+ Visualizer",
                vscode.ViewColumn.Two
            );
        }

        webPanel.webview.html = provider.provideTextDocumentContent(previewUri);

        webPanel.onDidDispose(
            () => {
                webPanel = undefined;
            },
            null,
            context.subscriptions
        );
    });

    let simplHelp = vscode.commands.registerCommand("extension.simpl_help", () => {
        let helpLocation = vscode.workspace.getConfiguration("simpl").helpLocation;
        let term = vscode.window.createTerminal('simpl', vscode.workspace.getConfiguration("simpl").terminalLocation);
        term.sendText("\"" + helpLocation + "\"");
    });

    let simplApi = vscode.commands.registerCommand("extension.simplCC_API", () => {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            let newAPI = new api.API(editor);
            newAPI.openAPIFiles();
        }
    });

    context.subscriptions.push(defaultCompile);
    context.subscriptions.push(selectTargetAndCompileSingle);
    context.subscriptions.push(selectTargetAndCompileMultiple);
    context.subscriptions.push(simplHelp);
    context.subscriptions.push(simplVisualize);
    context.subscriptions.push(simplApi);
    context.subscriptions.push(registration);
}

async function getTargets(): Promise<string> {
    let targets = "";
    let result = await vscode.window.showQuickPick(
        ["2-Series", "3-Series", "4-Series"],
        {canPickMany: true, ignoreFocusOut: true, placeHolder: "Select target processor series:"}
    );
    if ((result !== undefined) && result.length) {
        result.forEach(t => { targets += ("series" + parseInt(t) + " "); });
    }
    return(targets.trim());
}

function processSimpl(args: string) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("Please open a valid USP file.");
        return;
    }

    let doc = editor.document;
    if (doc.languageId === "simpl+") {
        let savedDoc = doc.save();
        savedDoc.then(() => {
            let compiler = new SimplCompiler();
            compiler.filepaths.push(doc.fileName);
            let term = vscode.window.createTerminal('simplCC', vscode.workspace.getConfiguration("simpl").terminalLocation);
            term.show();
            term.sendText(compiler.buildCommand(args));
        });
    }
    else {
        vscode.window.showErrorMessage("Please open a valid USP file.");
        return;
    }
}

class SimplCompiler {
    public filepaths: string[] = [];
    public compilerPath: string;

    constructor() {
        this.compilerPath = "\"" + vscode.workspace.getConfiguration("simpl").compiler + "\"";
        console.log(this.compilerPath);
    }

    public buildCommand(args: string): string {
        let filepathConcat = "";
        this.filepaths.forEach(element => {
            filepathConcat += "\"" + element + "\" ";
        });

        return this.compilerPath +
            " \\rebuild " +
            filepathConcat + " " +
            args;
    }

}


// this method is called when your extension is deactivated
export function deactivate() {
}