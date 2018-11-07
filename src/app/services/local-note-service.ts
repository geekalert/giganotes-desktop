import { Injectable } from '@angular/core';
import { Note } from './../model/note';
import { Folder } from './../model/folder';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { LoggerService } from './logger-service';
import { v4 as uuid } from 'uuid';
import { DbService } from './db-service';
import { AuthService } from './auth-service';

@Injectable()
export class LocalNoteService {

    allFieldsNote = 'id, title, text, folderId, level, userId, createdAt, updatedAt, deletedAt'
    allFieldsFolder = 'id, title, parentId, level, userId, createdAt, updatedAt, deletedAt'

    constructor(private loggerService: LoggerService,
        private authService: AuthService,
        private dbService: DbService) {
    }

    async uploadNote(note: Note) {
        let deletedAtTime = null
        if (note.deletedAt != null) {
            deletedAtTime = note.deletedAt.getTime()
        }
        await this.dbService.run('INSERT INTO note (' + this.allFieldsNote + ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);', [note.id, note.title, note.text, note.folderId, note.level, note.userId, note.createdAt.getTime(), note.updatedAt.getTime(), deletedAtTime]);
    }

    async updateNote(note: Note) {
        let deletedAtTime = null
        if (note.deletedAt != null) {
            deletedAtTime = note.deletedAt.getTime()
        }
        await this.dbService.run('UPDATE note SET title = ?, text = ?, folderId = ?, level = ?, userId = ?, createdAt = ?, updatedAt = ?, deletedAt = ? WHERE id = ?', [note.title, note.text, note.folderId, note.level, note.userId, note.createdAt.getTime(), note.updatedAt.getTime(), deletedAtTime, note.id]);
    }

    async uploadFolder(folder: Folder) {
        const hasFolder = await this.hasFolderWithId(folder.id)
        if (hasFolder)
            return

        let deletedAtTime = null
        if (folder.deletedAt != null) {
            deletedAtTime = folder.deletedAt.getTime()
        }
        await this.dbService.run('INSERT INTO folder (' + this.allFieldsFolder + ') VALUES (?, ?, ?, ?, ?, ?, ?, ?);', [folder.id, folder.title, folder.parentId, folder.level, folder.userId, folder.createdAt.getTime(), folder.updatedAt.getTime(), deletedAtTime]);
    }

    async hasFolderWithId(id: string): Promise<boolean> {
        const results = await this.dbService.all('SELECT COUNT(*) as count FROM folder WHERE id = ?', [id])
        return results.item(0).count > 0
    }

    async updateFolder(folder: Folder) {
        let deletedAtTime = null
        if (folder.deletedAt != null) {
            deletedAtTime = folder.deletedAt.getTime()
        }
        await this.dbService.run('UPDATE folder SET title = ?, parentId = ?, level = ?, userId = ?, createdAt = ?, updatedAt = ?, deletedAt = ? WHERE id = ?', [folder.title, folder.parentId, folder.level, folder.userId, folder.createdAt.getTime(), folder.updatedAt.getTime(), deletedAtTime, folder.id]);
    }

    async loadNoteById(id: string): Promise<Note> {
        const results = await this.dbService.all('SELECT ' + this.allFieldsNote + ' FROM note WHERE id = ?', [id])

        if (results.length === 0) {
            return null
        }

        const note = new Note();
        note.id = results.item(0).id
        note.text = results.item(0).text
        note.title = results.item(0).title
        note.folderId = results.item(0).folderId
        note.level = results.item(0).level
        note.userId = results.item(0).userId
        note.createdAt = new Date(results.item(0).createdAt)
        note.updatedAt = new Date(results.item(0).updatedAt)

        if (results.item(0).deletedAt != null) {
            note.deletedAt = new Date(results.item(0).deletedAt)
        }

        return Promise.resolve(note)
    }

    async removeNote(id: string) {
        await this.dbService.run('UPDATE note SET deletedAt = ? WHERE id = ?', [new Date().getTime(), id])
    }

    async removeFolder(id: string) {

        const allChildFoldersQuery = `WITH RECURSIVE children(id) AS (
    		SELECT id FROM folder WHERE id = ?
  		UNION ALL
    		SELECT f.id
    		FROM folder f
    		JOIN children c
			ON f.parentId = c.id)
			SELECT id FROM children`

        const folderIds = await this.dbService.all(allChildFoldersQuery, [id])
        const idsList = []

        for (let i = 0; i < folderIds.length; i++) {
            idsList.push(folderIds.item(i))
        }

        const ids = idsList.map(i => '"' + i.id + '"').join(',')

        await this.dbService.run('UPDATE folder SET deletedAt = ? WHERE id IN (' + ids + ')', [new Date().getTime()])
        await this.dbService.run('UPDATE note SET deletedAt = ? WHERE folderId IN (' + ids + ')', [new Date().getTime()])
    }

    // Shold be used in offline mode only.
    async createRootFolderIfNotExists() {
        let rootFolder= await this.getRootFolder()
        if (rootFolder == null) {
            let folder = new Folder()
            folder.title = 'Root'
            folder.level = 0
            folder.id = uuid()
            let now = new Date()
            folder.createdAt = now
            folder.updatedAt = now
            await this.dbService.run('INSERT INTO folder (' + this.allFieldsFolder + ') VALUES (?, ?, ?, ?, ?, ?, ?);', [folder.id, folder.title, folder.parentId, folder.level, this.authService.userId, folder.createdAt.getTime(), folder.updatedAt.getTime()]);
        }
    }

    async getRootFolder(): Promise<Folder> {
        const rootIdQueryResults = await this.dbService.all('SELECT id FROM folder WHERE parentId IS NULL and title="Root" and userId = ?', [this.authService.userId])

        if (rootIdQueryResults.length === 0) {
            return Promise.resolve(null)
        }

        return rootIdQueryResults.item(0)
    }

    async loadFolderById(id: string): Promise<Folder> {
        const folder = new Folder();

        const results = await this.dbService.all('SELECT ' + this.allFieldsFolder + ' FROM folder WHERE folder.id = ? AND userId = ?', [id, this.authService.userId])

        if (results.length === 0) {
            return Promise.resolve(null)
        }

        folder.id = results.item(0).id
        folder.title = results.item(0).title
        folder.level = results.item(0).level
        folder.parentId = results.item(0).parentId
        folder.userId = results.item(0).userId
        folder.createdAt = new Date(results.item(0).createdAt)
        folder.updatedAt = new Date(results.item(0).updatedAt)

        if (results.item(0).deletedAt != null) {
            folder.deletedAt = new Date(results.item(0).deletedAt)
        }

        return Promise.resolve(folder)
    }

    async loadNotesByFolder(folderId: string): Promise<Note[]> {
        const childNotesQuery = 'SELECT ' + this.allFieldsNote + ' FROM note WHERE deletedAt IS NULL AND folderId = ? AND userId = ? ORDER BY updatedAt DESC'
        const childNotesResults = await this.dbService.all(childNotesQuery, [folderId, this.authService.userId])

        const childNotes = new Array<Note>();

        for (let i = 0; i < childNotesResults.length; i++) {
            const entry = childNotesResults.item(i)
            const childNote = new Note();

            childNote.id = entry.id;
            childNote.title = entry.title;
            childNote.text = entry.text;
            childNote.folderId = entry.folderId;
            childNote.level = entry.level;
            childNote.createdAt = new Date(entry.createdAt)
            childNote.updatedAt = new Date(entry.updatedAt)
            childNote.userId = entry.userId

            childNotes.push(childNote);
        }

        return Promise.resolve(childNotes)
    }

    async loadFolderWithActualChildren(id: string): Promise<Folder> {
        const folder = await this.loadFolderById(id)

        const childFoldersQuery = 'SELECT ' + this.allFieldsFolder + ' FROM folder WHERE deletedAt IS NULL AND parentId = ? AND userId = ? ORDER BY updatedAt DESC'
        const childFoldersResults = await this.dbService.all(childFoldersQuery, [folder.id, this.authService.userId])

        if (childFoldersResults.length > 0) {
            folder.children = new Array<Folder>();
        }

        for (let i = 0; i < childFoldersResults.length; i++) {
            const entry = childFoldersResults.item(i);
            const childFolder = new Folder();
            childFolder.id = entry.id;
            childFolder.title = entry.title;
            childFolder.parentId = entry.parentId;
            childFolder.level = entry.level;
            childFolder.createdAt = new Date(entry.createdAt)
            childFolder.updatedAt = new Date(entry.updatedAt)
            childFolder.userId = entry.userId

            folder.children.push(childFolder)
        }

        const childNotesQuery = 'SELECT ' + this.allFieldsNote + ' FROM note WHERE deletedAt IS NULL AND folderId = ? AND userId = ? ORDER BY updatedAt DESC'
        const childNotesResults = await this.dbService.all(childNotesQuery, [folder.id, this.authService.userId])

        if (childNotesResults.length > 0) {
            folder.notes = new Array<Note>();
        }

        for (let i = 0; i < childNotesResults.length; i++) {
            const entry = childNotesResults.item(i)
            const childNote = new Note();

            childNote.id = entry.id;
            childNote.title = entry.title;
            childNote.text = entry.text;
            childNote.folderId = entry.folderId;
            childNote.level = entry.level;
            childNote.createdAt = new Date(entry.createdAt)
            childNote.updatedAt = new Date(entry.updatedAt)
            childNote.userId = entry.userId

            folder.notes.push(childNote);
        }

        return Promise.resolve(folder)
    }

    async getAllNotes(includeDeleted: boolean): Promise<Note[]> {
        var query: string
        if (includeDeleted) {
            query = 'SELECT ' + this.allFieldsNote + ' FROM note WHERE userId = ? ORDER BY updatedAt DESC'
        } else {
            query = 'SELECT ' + this.allFieldsNote + ' FROM note WHERE deletedAt IS NULL AND userId = ? ORDER BY updatedAt DESC'
        }
        const results = await this.dbService.all(query, [this.authService.userId])

        const notes = Array<Note>();
        for (let i = 0; i < results.length; i++) {
            const entry = results.item(i);
            const note = new Note();
            note.id = entry.id;
            note.title = entry.title;
            note.text = entry.text;
            note.folderId = entry.folderId;
            note.level = entry.level;
            note.createdAt = new Date(entry.createdAt)
            note.updatedAt = new Date(entry.updatedAt)

            if (note.deletedAt != null) {
                note.deletedAt = new Date(entry.deletedAt)
            }

            note.userId = entry.userId

            if (includeDeleted || note.deletedAt == null) {
                notes.push(note)
            }
        }

        return Promise.resolve(notes)
    }

    async getAllFolders(includeDeleted: boolean): Promise<Folder[]> {
        var query: string
        if (includeDeleted) {
            query = 'SELECT ' + this.allFieldsFolder + ' FROM folder WHERE userId = ? ORDER BY updatedAt DESC'
        } else {
            query = 'SELECT ' + this.allFieldsFolder + ' FROM folder WHERE deletedAt IS NULL AND userId = ? ORDER BY updatedAt DESC'
        }
        const results = await this.dbService.all(query, [this.authService.userId])

        const folders = Array<Folder>()
        for (let i = 0; i < results.length; i++) {
            const entry = results.item(i);
            const folder = new Folder();
            folder.id = entry.id;
            folder.title = entry.title;
            folder.parentId = entry.parentId;
            folder.level = entry.level;
            folder.createdAt = new Date(entry.createdAt)
            folder.updatedAt = new Date(entry.updatedAt)

            if (folder.deletedAt != null) {
                folder.deletedAt = new Date(entry.deletedAt)
            }

            folder.userId = entry.userId

            if (includeDeleted || folder.deletedAt == null) {
                folders.push(folder)
            }
        }

        return Promise.resolve(folders)
    }

    async searchNotes(query: string, folderId: string): Promise<Note[]> {
        let sqlQuery = 'SELECT id FROM note WHERE deletedAt IS NULL AND (title LIKE "%' + query + '%" OR text LIKE "%' + query + '%") AND userId = ?'
        let noteResults;
        
        if (folderId == null) {            
            sqlQuery += ' ORDER BY updatedAt DESC'
            noteResults = await this.dbService.all(sqlQuery, [this.authService.userId])
        } else {
            sqlQuery += ' AND folderId = ? ORDER BY updatedAt DESC'
            noteResults = await this.dbService.all(sqlQuery, [this.authService.userId, folderId])
        }
        const notes = Array<Note>();
        for (let i = 0; i < noteResults.length; i++) {
            const entry = noteResults.item(i);
            notes.push(await this.loadNoteById(entry.id))
        }

        return Promise.resolve(notes)
    }

    async getFavoriteNotes(): Promise<Note[]> {
        let sqlQuery = 'SELECT n.id, n.title, n.text, n.folderId, n.level, n.userId, n.createdAt, n.updatedAt, n.deletedAt FROM note n INNER JOIN favorites f ON n.id = f.noteId AND n.userId = f.userId WHERE deletedAt IS NULL AND n.userId = ? ORDER BY n.updatedAt DESC'
        const results = await this.dbService.all(sqlQuery, [this.authService.userId])
        
        const notes = Array<Note>();
        for (let i = 0; i < results.length; i++) {
            const entry = results.item(i);
            const note = new Note();
            note.id = entry.id;
            note.title = entry.title;
            note.text = entry.text;
            note.folderId = entry.folderId;
            note.level = entry.level;
            note.createdAt = new Date(entry.createdAt)
            note.updatedAt = new Date(entry.updatedAt)

            note.userId = entry.userId

            notes.push(note)            
        }

        return Promise.resolve(notes)
    }

    async addToFavorites(noteId: string) {
        await this.dbService.run('INSERT INTO favorites (noteId, userId) VALUES (?, ?);', [noteId, this.authService.userId]);
    }

    async removeFromFavorites(noteId: string) {
        await this.dbService.run('DELETE FROM favorites WHERE noteId = ? AND userId = ?', [noteId, this.authService.userId])
    }
}
