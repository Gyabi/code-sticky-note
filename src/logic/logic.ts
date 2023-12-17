import * as vscode from 'vscode';
import { isExistsFile, createFile, readFile } from "./io";
import { MyTreeDataProvider } from '../view/view';
import { logging } from '../log/logging';

const view = new MyTreeDataProvider();

export function registerCommands(context: vscode.ExtensionContext) {
    let disposables: vscode.Disposable[] = [];
	// 初期化コマンド
    disposables.push(vscode.commands.registerCommand('code-sticky-note.init', init));

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
    const disposable = vscode.window.registerTreeDataProvider('code-sticky-note-view', view);
    context.subscriptions.push(disposable);
}

/**
 * 初期化コマンド
 */
async function init() {
    logging('Initializing...');
    // ファイルが存在しない場合は作成
    if (!isExistsFile()) {
        createFile();
        view.refresh();
        logging('Initialized.');
    }
    else {
        logging('Already initialized.');
    }
}