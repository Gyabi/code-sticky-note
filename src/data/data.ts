export class CodeStickyNoteJsonData {
    version: string;
    notes: CodeStickyNoteJsonDataNote[];

    constructor(version: string, notes: CodeStickyNoteJsonDataNote[]) {
        this.version = version;
        this.notes = notes;
    }
}

export class CodeStickyNoteJsonDataNote {
    id: number;
    title: string;
    body: string;
    tags: string[];

    constructor(id: number, title: string, body: string, tags: string[]) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.tags = tags;
    }
}