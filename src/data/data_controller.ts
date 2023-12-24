import { CodeStickyNoteJsonData, CodeStickyNoteJsonDataNote, CodeStickyNoteJsonDataPage } from "../data/data";
import { readFile, writeFile } from "../logic/io";
import { isExistsFile } from "../logic/io";
import { TreeNode } from "../view/view";
import { v4 as uuidv4 } from 'uuid';

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

    /**
     * データを保存
     */
    public save() {
        if(this._data) {
            const data = JSON.stringify(this._data);
            // ファイルの有無を判定
            this.isExistsFile = isExistsFile();
            writeFile(data);
        }
    }

    public update(file_uri: string, row: number, body: string, git_hash: string) {
        // 保有するデータ内にfile_uriが等しいページが存在するか検索
        const page = this._data?.pages.find((page:CodeStickyNoteJsonDataPage) => {
            return page.file_uri === file_uri;
        });

        // ノートが存在しないのであれば新規にノートとページを作成し、ページを返却する
        if(!page) {
            const newPage = new CodeStickyNoteJsonDataPage(
                uuidv4(),
                file_uri,
                []
            );
            const newNote = new CodeStickyNoteJsonDataNote(
                uuidv4(),
                body,
                row,
                git_hash
            );
            newPage.notes.push(newNote);
            this._data?.pages.push(newPage);
        }
        // 存在するならrowが等しいノートが存在するか検索
        else {
            const note = page?.notes.find((note:CodeStickyNoteJsonDataNote) => {
                return note.row === row;
            });

            // ノートが存在するならそのノートを更新
            if(note) {
                note.body = body;
            }
            // ノートが存在しないのであれば新規にノートを作成
            else {
                const newNote = new CodeStickyNoteJsonDataNote(
                    uuidv4(),
                    body,
                    row,
                    git_hash
                );
                page?.notes.push(newNote);
            }
        }

        // データを保存
        this.save();
    }
    
    
    /**
     * データの新規作成
     */
    public create(file_uri: string, row: number, git_hash: string): CodeStickyNoteJsonDataNote {
        // 保有するデータ内にfile_uriが等しいページが存在するか検索
        const page = this._data?.pages.find((page:CodeStickyNoteJsonDataPage) => {
            return page.file_uri === file_uri;
        });

        // ノートが存在しないのであれば新規にノートとページを作成し、ページを返却する
        if(!page) {
            const newPage = new CodeStickyNoteJsonDataPage(
                uuidv4(),
                file_uri,
                []
            );
            const newNote = new CodeStickyNoteJsonDataNote(
                uuidv4(),
                '',
                row,
                git_hash
            );
            newPage.notes.push(newNote);
            this._data?.pages.push(newPage);
            return newNote;
        }


        // 存在するならrowが等しいノートが存在するか検索
        const note = page?.notes.find((note:CodeStickyNoteJsonDataNote) => {
            return note.row === row;
        });

        // ノートが存在するならそのノートを返却する
        if(note) {
            return note;
        }
        // ノートが存在しないのであれば新規にノートを作成し、ノートを返却する
        else {
            const newNote = new CodeStickyNoteJsonDataNote(
                uuidv4(),
                '',
                row,
                git_hash
            );
            page?.notes.push(newNote);
            return newNote;
        }
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