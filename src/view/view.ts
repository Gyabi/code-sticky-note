import * as vscode from 'vscode';
import { getDataController } from '../logic/logic';

export class CSNFullTreeDataProvider implements vscode.TreeDataProvider<TreeNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeNode | undefined> = new vscode.EventEmitter<TreeNode | undefined>();
    readonly onDidChangeTreeData: vscode.Event<TreeNode | undefined> = this._onDidChangeTreeData.event;

    getTreeItem(element: TreeNode): vscode.TreeItem {
        return element;
    }

	getChildren(element?: TreeNode): Thenable<TreeNode[]> {
		if (element) {
			return Promise.resolve(element.children);
		} else {
            // ノートを記録したファイルの有無を判定
            const dataController = getDataController();

            if(dataController.isExistsFile) {
                // ファイルが存在するなら読み込み済みのデータへアクセスし表示
                return Promise.resolve(
                    dataController.getTreeNode()
                );
            }
            else {
                return Promise.resolve([
                    // 空データを返してpackage.jsonで定義しているウェルカムメッセージを表示する
                ]);
            }
		}
	}
    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }
}

export class CSNCurrentFileTreeDataProvider implements vscode.TreeDataProvider<TreeNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeNode | undefined> = new vscode.EventEmitter<TreeNode | undefined>();
    readonly onDidChangeTreeData: vscode.Event<TreeNode | undefined> = this._onDidChangeTreeData.event;

    getTreeItem(element: TreeNode): vscode.TreeItem {
        return element;
    }

	getChildren(element?: TreeNode): Thenable<TreeNode[]> {
		if (element) {
			return Promise.resolve(element.children);
		} else {
            // ノートを記録したファイルの有無を判定
            const dataController = getDataController();

            if(dataController.isExistsFile) {
                // ファイルが存在するなら読み込み済みのデータへアクセスし表示
                return Promise.resolve(
                    dataController.getTreeNode()
                );
            }
            else {
                return Promise.resolve([
                    // 空データを返してpackage.jsonで定義しているウェルカムメッセージを表示する
                ]);
            }
		}
	}
    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }
}



export class TreeNode extends vscode.TreeItem {
    children: TreeNode[];

    constructor({label, collapsibleState, command, children}: {label: string, collapsibleState: vscode.TreeItemCollapsibleState, command?: vscode.Command, children?: TreeNode[]}) {
        super(label, collapsibleState);
        this.command = command;
        this.children = children || [];
    }
}