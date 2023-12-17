// jsonファイルの読み書きを行うAPIを提供する
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { logging } from '../log/logging';
import { CodeStickyNoteJsonData } from '../data/data';

/**
 * スティッキーノートの保存ファイルを読み込みます。
 * ファイルが存在しない場合は例外をスローします。
 *
 * @returns {boolean} ファイルが存在する場合はtrue、存在しない場合はfalse。
 */
export function isExistsFile(): boolean {
    const filePath = getFilePath();
    return fs.existsSync(filePath);
}

/**
 * スティッキーノートの保存ファイルを生成します。
 *
 */
export function createFile() {
    const filePath = getFilePath();
    // すでに存在するなら何もしない
    if (fs.existsSync(filePath)) {
        logging(filePath + 'is already exists.');
        return;
    }

    // ファイルを作成
    writeFileSyncRecursive(filePath, JSON.stringify(new CodeStickyNoteJsonData('0.0.1', [])));
}

/**
 * スティッキーノートの保存ファイルを読み込みます。
 * ファイルが存在しない場合は例外をスローします。
 *
 * @returns {string} スティッキーノートの保存ファイルの内容。
 */
export function readFile(): string {
    const filePath = getFilePath();
    if (!fs.existsSync(filePath)) {
        throw new Error('File not found.');
    }
    return fs.readFileSync(filePath, 'utf8');
}

/**
 * スティッキーノートの保存ファイルを書き込みます。
 * ファイルが存在しない場合は例外をスローします。
 *
 * @param {string} data スティッキーノートの保存ファイルに書き込む内容。
 */
export function writeFile(data: string) {
    const filePath = getFilePath();
    
    if (!fs.existsSync(filePath)) {
        throw new Error('File not found.');
    }

    writeFileSyncRecursive(filePath, data);
}


/**
 * スティッキーノートの保存ファイルのファイルパスを返します。
 * ファイルパスは、ワークスペースのパス、保存フォルダ名、保存ファイル名を使用して構築されます。
 * 保存フォルダ名と保存ファイル名は、VS Codeの設定から取得されます。
 *
 * @returns {string} スティッキーノートの保存ファイルのファイルパス。
 */
function getFilePath(): string {
    const workspacePath = getWorkspacePath();
    const folderName = vscode.workspace.getConfiguration().get("code-sticky-note.saveFolderName") as string;
    const fileName = vscode.workspace.getConfiguration().get("code-sticky-note.saveFileName") as string;

    return path.join(workspacePath, folderName, fileName+'.json');
}

/**
 * ワークスペースのパスを返します。
 * ワークスペースが見つからない場合は例外をスローします。
 *
 * @returns {string} ワークスペースのパス。
 */
function getWorkspacePath(): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        throw new Error('Workspace not found.');
    }
    return workspaceFolders[0].uri.fsPath;
}


/**
 * 再帰的にフォルダを生成してファイルを書き込みます。
 * @param filePath ファイルパス
 * @param data 保存するデータ
 */
function writeFileSyncRecursive(filePath:string, data:string) {
    const dirname = path.dirname(filePath);
  
    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
  
    // ファイルを書き込む
    fs.writeFileSync(filePath, data);
  }