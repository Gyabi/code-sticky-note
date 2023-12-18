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
    body: string;
    row: number;

    constructor(id: string, body: string, row: number) {
        this.id = id;
        this.body = body;
        this.row = row;
    }
}