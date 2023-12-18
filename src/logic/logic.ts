import * as vscode from 'vscode';
import { isExistsFile, createFile, readFile } from "./io";
import { CSNCurrentFileTreeDataProvider, CSNFullTreeDataProvider } from '../view/view';
import { logging } from '../log/logging';
import { DataController } from '../data/data_controller';
const dataController = new DataController();
const view_full = new CSNFullTreeDataProvider();
const view_current = new CSNCurrentFileTreeDataProvider();

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
    let disposables: vscode.Disposable[] = [];
    
    disposables.push(vscode.window.registerTreeDataProvider('code-sticky-note-view-full', view_full));
    disposables.push(vscode.window.registerTreeDataProvider('code-sticky-note-view-current', view_current));
    
    context.subscriptions.push(...disposables);  
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


/**
 * データ管理インスタンスを返却
 * @returns dataController
 */
export function getDataController(): DataController {
    return dataController;
}