import * as vscode from 'vscode';
import { registerCommands, registerView } from './logic/logic';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// コマンド登録
	registerCommands(context);
	
	// View関連登録
	registerView(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}

