import { Injectable } from '@angular/core';
import { Note } from './../model/note';
import { Folder } from './../model/folder';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { LoggerService } from './logger-service';
import { v4 as uuid } from 'uuid';
import { AuthService } from './auth-service';

@Injectable()
export class LocalNoteService {

    constructor() {
    }

    async uploadNote(note: Note) {
    }

    async updateNote(note: Note) {
    }

    async uploadFolder(folder: Folder) {
    }

    async hasFolderWithId(id: string): Promise<boolean> {
        return false;
    }

    async updateFolder(folder: Folder) {
    }

    async loadNoteById(id: string): Promise<Note> {
        return null;
    }

    async removeNote(id: string) {
    }

    async removeFolder(id: string) {
    }

    // Shold be used in offline mode only.
    async createRootFolderIfNotExists() {
    }

    async getRootFolder(): Promise<Folder> {
        return null;
    }

    async loadFolderById(id: string): Promise<Folder> {
        return null;
    }

    async loadNotesByFolder(folderId: string): Promise<Note[]> {
        return new Array<Note>();
    }

    async loadFolderWithActualChildren(id: string): Promise<Folder> {
        return null;
    }

    async getAllNotes(includeDeleted: boolean): Promise<Note[]> {
        return new Array<Note>();
    }

    async getAllFolders(includeDeleted: boolean): Promise<Folder[]> {
        return new Array<Folder>();
    }

    async searchNotes(query: string, folderId: string): Promise<Note[]> {
        return new Array<Note>();    }

    async getFavoriteNotes(): Promise<Note[]> {
        return new Array<Note>();
    }

    async addToFavorites(noteId: string) {
    }

    async removeFromFavorites(noteId: string) {
    }
}
