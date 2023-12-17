import * as vscode from 'vscode';

// ロギング用のチャンネルを作成
const outputChannel = vscode.window.createOutputChannel("Code Sticky Note");

/**
 * ログを出力します。
 * @param message ログメッセージ
 */
export function logging(message: string) {
    outputChannel.appendLine(message);
}