import { Folder } from '../model/folder';

export class Note {
    id: string;
    title: string;
    text: string;
    folderId: string;
    level: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    deletedAt: Date;

    constructor() {
        this.id = null;
        this.folderId = null;
        this.updatedAt = null;
        this.deletedAt = null;
    }
}
