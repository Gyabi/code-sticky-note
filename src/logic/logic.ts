import * as vscode from 'vscode';
import { isExistsFile, createFile, readFile } from "./io";
import { CSNCurrentFileTreeDataProvider, CSNFullTreeDataProvider } from '../view/view';
import { logging } from '../log/logging';
import { DataController } from '../data/data_controller';
import { CodeStickyNoteJsonDataPage, CodeStickyNoteJsonDataNote } from '../data/data';
const dataController = new DataController();
const view_full = new CSNFullTreeDataProvider();
const view_current = new CSNCurrentFileTreeDataProvider();

export function registerCommands(context: vscode.ExtensionContext) {
    let disposables: vscode.Disposable[] = [];
	// 初期化コマンド
    disposables.push(vscode.commands.registerCommand('code-sticky-note.init', init));
    // ノートを開くコマンド
    disposables.push(vscode.commands.registerCommand('code-sticky-note.open', open));
    // ノートを保存するコマンド
    disposables.push(vscode.commands.registerCommand('code-sticky-note.update', update));


	// 表示コマンド
	// 保存コマンド
	// 削除コマンド
	// ファイル名検索コマンド
    context.subscriptions.push(...disposables);
}

/**
 * ビューを登録します。
 * @param context コンテキスト
 */
export function registerView(context: vscode.ExtensionContext) {
    let disposables: vscode.Disposable[] = [];
    
    disposables.push(vscode.window.registerTreeDataProvider('code-sticky-note-view-full', view_full));
    disposables.push(vscode.window.registerTreeDataProvider('code-sticky-note-view-current', view_current));
    
    context.subscriptions.push(...disposables);  
}

/**
 * フックを登録します。
 * @param context コンテキスト
 */
export function setHooks(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(async (document: vscode.TextDocument) => {
            if (document) {
                // 取得したファイルがfileかgitかを判定する
                if(document.uri.scheme === 'file') {
                    logging(`this is file path: ${document.uri.path}`);
                    logging(`Opened file: ${document.uri}`);
                    logging(`Opened file: ${document.fileName}`);
                } else if (document.uri.scheme === 'git') {
                    logging(`this is git path: ${document.uri.path}`);
                    logging(`Opened git: ${document.uri}`);
                    logging(`Opened git: ${document.fileName}`);
                }
            }
        }
    ));
}

/**
 * 初期化コマンド
 */
async function init() {
    logging('Initializing...');
    // ファイルが存在しない場合は作成
    if (!isExistsFile()) {
        createFile();
        view_full.refresh();
        logging('Initialized.');
    }
    else {
        logging('Already initialized.');
    }
}


async function highlightDecoration() {
    // デコレーションタイプを作成します。この例では背景色をうっすら黄色に設定しています。
    const highlightDecoration = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 255, 0, 0.3)'
    });
    
    // 特定の行をハイライトする関数
    function highlightLine(lineNumber: number) {
        const activeEditor = vscode.window.activeTextEditor;
    
        if (activeEditor) {
            const line = activeEditor.document.lineAt(lineNumber);
            const range = new vscode.Range(lineNumber, 0, lineNumber, line.text.length);
            activeEditor.setDecorations(highlightDecoration, [range]);
        }
    }
    
    // 例えば、10行目をハイライトする場合
    highlightLine(1); // 行番号は0から始まるため、10行目はインデックス9になります。
}


/**
 * ノートを開くコマンド
 */
async function open() {
    logging('Open!!');
    // 設定ファイルが存在しないなら早期リターン
    if (dataController.isExistsFile === false) {
        logging('Not initialized.');
        return;
    }

    // 現在のファイルuri、カーソル位置、git管理されている場合はgitのハッシュ値を取得する
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        const fileName = document.fileName;
        const file_uri = document.uri.toString();
        const cursorPosition = editor.selection.active;
        const gitHash = '';
        logging(`fileName: ${fileName}`);
        logging(`cursorPosition: ${cursorPosition}`);
        logging(`gitHash: ${gitHash}`);


        // 取得したデータをもとにすでにノートの情報を取得（存在しない場合は自動生成）　
        let note: CodeStickyNoteJsonDataNote = dataController.create(file_uri, cursorPosition.line, gitHash);
        
        const panel = vscode.window.createWebviewPanel(
            'code-sticky-note',
            'Code Sticky Note',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = getWebviewContent(note);
    }
    else {
        logging('No active editor.');
    }
}

/**
 * ノートを表示するためのHTMLを返します。
 * 入力エリアとUpdateボタンを配置
 * @param note ノート
 * @returns HTML
 */
function getWebviewContent(note: CodeStickyNoteJsonDataNote) {
    return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <title>Code Sticky Note</title>
    </head>
    <body>
        <textarea id="note" rows="10" cols="50">${note.body}</textarea>
        <button id="update">Update</button>
        <script>

        </script>
    </body>
    </html>
    `; 
}

/**
 * ノートを保存するコマンド
 */
async function update(file_uri: string, row: number, git_hash: string, body: string) {
    logging('Save!!');
    // 設定ファイルが存在しないなら早期リターン
    if (dataController.isExistsFile === false) {
        logging('Not initialized.');
        return;
    }

    dataController.update(file_uri, row, body, git_hash);
}



/**
 * データ管理インスタンスを返却
 * @returns dataController
 */
export function getDataController(): DataController {
    return dataController;
}