import * as vscode from 'vscode';
import { filterComments } from './utils';
import { join, dirname } from 'path';
//import { existsSync, statSync } from 'fs'; // don't need statSync unless/until api generation gets reintroduced
import { existsSync } from 'fs';

export class API {
    public editor: vscode.TextEditor;
    public fileText: string = '';

    constructor(editor: vscode.TextEditor) {
        this.editor = editor;
        this.fileText = filterComments(editor.document.getText());
    }

    public openAPIFiles() {
        let libs = this.getLibraryNames();
        if (libs) {
            let files = this.filterLibraryNames(libs);
            files.forEach(e => {
                let apiPath = this.buildFilePath(e, '.api');

                // START OF NEW API OPENING FUNCTIONALITY
               
                if (!this.openFile(apiPath)) { 
                    vscode.window.showErrorMessage('SIMPL+: Unable to locate API file ' + apiPath);
                }
                
                // END OF NEW API OPENING FUNCTIONALITY

                /*

                // This is the original api processing functionality when api generation was possible

                if (this.checkRecent(e)) {
                    if (this.openFile(apiPath)) {
                        console.log('Successfully opened ' + apiPath);
                    }
                }
                else if (this.generateAPIFile(e)) {
                    setTimeout(() => this.openFile(apiPath), 1500);
                }
                else {
                    vscode.window.showErrorMessage('We were unable to find or generate the API file: ' + apiPath);
                }

                */
            });
        }
    }

    private getLibraryNames(): RegExpMatchArray | null {
        return this.fileText.match(/#USER_SIMPLSHARP_LIBRARY\s*?"([\S\s]*?)"/gmi);
    }

    private filterLibraryNames(arr: RegExpMatchArray): string[] {
        let results: string[] = [];
        arr.forEach(e => {
            let match = e.match(/#USER_SIMPLSHARP_LIBRARY\s*?"([\S\s]*?)"/mi);
            if (match) {
                results.push(match[1].toString());
            }
        });
        return results;
    }

    private buildFilePath(filename: string, extension: string): string {
        let path = dirname(this.editor.document.uri.fsPath);
        return join(path, 'SPlsWork', filename + extension);
    }

    private openFile(filepath: string): boolean {
        let apiPath = filepath;
        if (!existsSync(apiPath)) {
            apiPath = apiPath.replace(/\./g, "_"); // convert all dots to underscores
            apiPath = apiPath.replace(/_api$/, ".h"); // switch the extension to look for a raw header file
        }
        if (existsSync(apiPath)) {
            if (apiPath.endsWith("h")) {
                let re = /[^\\]+$/;
                let api = re.exec(filepath);
                let h = re.exec(apiPath);
                vscode.window.showWarningMessage("Could not locate " + api + ", displaying " + h + " as a fallback.");
            }
            let options: vscode.TextDocumentShowOptions = {};
            options.preview = false;
            let uri = vscode.Uri.file(apiPath);
            vscode.workspace.openTextDocument(uri).then(document => {
                // need to do this in case .h fallback file is loaded and gets assumed as another language (C, etc.)
                vscode.languages.setTextDocumentLanguage(document, "simpl#_api");
                vscode.window.showTextDocument(document, options);
            });
            return true;
        }
        return false;
    }

    /*

    // Currently disabled - the SPlusHeader.exe file is no longer supplied.  Its functionality
    // has been rolled into SPlusUtilities.dll library

    private generateAPIFile(filename: string): boolean {
        let dll = this.buildFilePath(filename, '.dll');
        let api = this.buildFilePath(filename, '.api');
        let exe = this.buildFilePath('SPlusHeader', '.exe');

        if (existsSync(dll) && existsSync(exe)) {
            let term = vscode.window.createTerminal('simplHeader', vscode.workspace.getConfiguration("simpl").terminalLocation);
            term.show();
            term.sendText('"' + exe + '" "' + dll + '" "' + api + '"');
            return true;
        }
        return false;
    }

    private checkRecent(filename: string) {
        let api = this.buildFilePath(filename, '.api');
        let dll = this.buildFilePath(filename, '.dll');
        if (existsSync(api) && existsSync(dll)) {
            let apiStat = statSync(api);
            let dllStat = statSync(dll);
            if (apiStat.mtime > dllStat.mtime) {
                return true;
            }
        }
        return false;
    }

    */
}