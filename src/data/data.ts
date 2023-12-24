export class CodeStickyNoteJsonData {
    version: string;
    pages: CodeStickyNoteJsonDataPage[];

    constructor(version: string, pages: CodeStickyNoteJsonDataPage[]) {
        this.version = version;
        this.pages = pages;
    }
}

export class CodeStickyNoteJsonDataPage {
    id: string;
    file_uri: string;
    notes: CodeStickyNoteJsonDataNote[];

    constructor(id: string, file_uri: string, notes: CodeStickyNoteJsonDataNote[]) {
        this.id = id;
        this.file_uri = file_uri;
        this.notes = notes;
    }
}

export class CodeStickyNoteJsonDataNote {
    id: string;
    row: number;
    git_hash: string;
    body: string;

    constructor(id: string, body: string, row: number, git_hash: string) {
        this.id = id;
        this.row = row;
        this.git_hash = git_hash;
        this.body = body;
    }
}