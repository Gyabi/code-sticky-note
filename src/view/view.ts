import * as vscode from 'vscode';
import { isExistsFile } from '../logic/io';

export class MyTreeDataProvider implements vscode.TreeDataProvider<TreeNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeNode | undefined> = new vscode.EventEmitter<TreeNode | undefined>();
    readonly onDidChangeTreeData: vscode.Event<TreeNode | undefined> = this._onDidChangeTreeData.event;

    getTreeItem(element: TreeNode): vscode.TreeItem {
        return element;
    }

	getChildren(element?: TreeNode): Thenable<TreeNode[]> {
		if (element) {
			return Promise.resolve(element.children);
		} else {
            if(isExistsFile()) {
                return Promise.resolve([
                    new TreeNode({label: 'Item 1', collapsibleState: vscode.TreeItemCollapsibleState.None}),
                    new TreeNode({label: 'Item 2', collapsibleState: vscode.TreeItemCollapsibleState.None}),
                    new TreeNode({
                        label: 'Item 3', 
                        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed, 
                        children: [
                            new TreeNode({label: 'SubItem 1', collapsibleState: vscode.TreeItemCollapsibleState.None}),
                            new TreeNode({label: 'SubItem 2', collapsibleState: vscode.TreeItemCollapsibleState.None})
                        ]
                    }),
                    new TreeNode({
                        label: 'Item 4', 
                        collapsibleState: vscode.TreeItemCollapsibleState.None, 
                        command: {
                            command: 'code-sticky-note.refresh',
                            title: '',
                            arguments: []
                        }
                    })
                ]);
            }
            else {
                return Promise.resolve([
                    // new TreeNode({label: 'Item 1', collapsibleState: vscode.TreeItemCollapsibleState.None}),
                    // new TreeNode({label: 'Item 2', collapsibleState: vscode.TreeItemCollapsibleState.None}),
                    // new TreeNode({
                    //     label: 'Item 3', 
                    //     collapsibleState: vscode.TreeItemCollapsibleState.Collapsed, 
                    //     children: [
                    //         new TreeNode({label: 'SubItem 1', collapsibleState: vscode.TreeItemCollapsibleState.None}),
                    //         new TreeNode({label: 'SubItem 2', collapsibleState: vscode.TreeItemCollapsibleState.None})
                    //     ]
                    // }),
                    // new TreeNode({
                    //     label: 'Item 4', 
                    //     collapsibleState: vscode.TreeItemCollapsibleState.None, 
                    //     command: {
                    //         command: 'code-sticky-note.refresh',
                    //         title: '',
                    //         arguments: []
                    //     }
                    // })
                ]);
            }
		}
	}
    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }
}

class TreeNode extends vscode.TreeItem {
    children: TreeNode[];

    constructor({label, collapsibleState, command, children}: {label: string, collapsibleState: vscode.TreeItemCollapsibleState, command?: vscode.Command, children?: TreeNode[]}) {
        super(label, collapsibleState);
        this.command = command;
        this.children = children || [];
    }
}