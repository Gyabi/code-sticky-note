import { CodeStickyNoteJsonData, CodeStickyNoteJsonDataNote, CodeStickyNoteJsonDataPage } from "../data/data";
import { readFile } from "../logic/io";
import { isExistsFile } from "../logic/io";
import { TreeNode } from "../view/view";

import * as vscode from 'vscode';

/**
 * ノートのデータを管理するクラス
 */
export class DataController {
    private _data: CodeStickyNoteJsonData | null = null;
    public isExistsFile: boolean = false;

    constructor() {
        // ファイルの有無を判定
        this.isExistsFile = isExistsFile();

        // 存在する場合は読み込みを実行
        if(this.isExistsFile) {
            this.load();
        }
    }

    /**
     * データを読み込み
     */
    public load() {
        const data = readFile();
        this._data = JSON.parse(data);
    }

    get data(): CodeStickyNoteJsonData | null {
        return this._data;
    }

    set data(data: CodeStickyNoteJsonData) {
        this._data = data;
    }

    // データをTreeNode形式にして返却
    public getTreeNode(): TreeNode[] {
        if(this._data) {
            return this._data.pages.map((page:CodeStickyNoteJsonDataPage) => {
                return new TreeNode({
                    label: page.file_uri,
                    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                    children: page.notes.map((note:CodeStickyNoteJsonDataNote) => {
                        return new TreeNode({
                            label: note.body,
                            collapsibleState: vscode.TreeItemCollapsibleState.None
                        });
                    })
                });
            });
        }
        else {
            return [];
        }
    }
} 