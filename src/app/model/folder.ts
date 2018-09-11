import { Note } from '../model/note';

export class Folder {
    id: string;
    title: string;
    parentId: string;
    children: Folder[];
    notes: Note[];
    level: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    deletedAt: Date;
    
    constructor() {
        this.id = null;
        this.parentId = null;
        this.updatedAt = null;
        this.deletedAt = null;
    }
}
