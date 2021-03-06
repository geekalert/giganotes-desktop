import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Note } from './../model/note';
import { Folder } from './../model/folder';
import { SyncDataHolder } from './../model/sync-data-holder';
import { AppConfig } from '../../environments/environment';
import { AuthService } from '../services/auth-service';
import { HttpHeaders } from '@angular/common/http';
import { SaveDataResponse } from '../model/server-responses-models/save-data-response';

@Injectable()
export class RemoteNoteService {

    private headers: HttpHeaders;

    constructor(readonly authHttp: HttpClient,
        readonly authService: AuthService,
        private readonly jwtHelper: JwtHelperService) {
        this.headers = new HttpHeaders()
            .set('ClientType', AppConfig.clientType);
    }

    async setClientID() {
        const jwt = await this.authService.storage.get('jwt')
        const token = this.jwtHelper.decodeToken(jwt)
        this.headers.append("ClientID", token['jti'])
    }

    async uploadNote(note: Note) {
        await this.setClientID()
        await this.authHttp.post(AppConfig.scheme + AppConfig.apiUrl + `/api/upload-note`, note, { responseType: 'json', observe: 'body', headers: this.headers }).toPromise();
    }

    async updateNote(note: Note) {
        await this.setClientID()
        await this.authHttp.post(AppConfig.scheme + AppConfig.apiUrl + `/api/update-note`, note, { responseType: 'json', observe: 'body', headers: this.headers }).toPromise();
    }

    async uploadFolder(folder: Folder) {
        await this.setClientID()
        await this.authHttp.post(AppConfig.scheme + AppConfig.apiUrl + `/api/upload-folder`, folder, { responseType: 'json', observe: 'body', headers: this.headers }).toPromise();
    }

    async updateFolder(folder: Folder) {
        await this.setClientID()
        await this.authHttp.post(AppConfig.scheme + AppConfig.apiUrl + `/api/update-folder`, folder, { responseType: 'json', observe: 'body', headers: this.headers }).toPromise();
    }

    async loadNoteById(id: string): Promise<Note> {
        await this.setClientID()
        const note = await this.authHttp.get<Note>(AppConfig.scheme + AppConfig.apiUrl + `/api/note/` + id, { responseType: 'json', observe: 'body', headers: this.headers })
            .toPromise();
        this.setDatesForNote(note)

        return Promise.resolve(note)
    }

    async removeNote(id: string) {
        await this.setClientID()
        await this.authHttp.get(AppConfig.scheme + AppConfig.apiUrl + `/api/remove-note/` + id, { responseType: 'json', observe: 'body', headers: this.headers }).toPromise();
    }

    async removeFolder(id: string) {
        await this.setClientID()
        await this.authHttp.get(AppConfig.scheme + AppConfig.apiUrl + `/api/remove-folder/` + id, { responseType: 'json', observe: 'body', headers: this.headers })
            .toPromise();
    }

    async loadFolderById(id: string): Promise<Folder> {
        await this.setClientID()
        let requestUrl = AppConfig.scheme + AppConfig.apiUrl + `/api/folder/` + id

        const folder = await this.authHttp.get<Folder>(requestUrl, { responseType: 'json', observe: 'body', headers: this.headers })
            .toPromise();

        this.setDatesForFolder(folder)

        return Promise.resolve(folder);
    }

    async getLatestSyncData(includeDeleted: boolean): Promise<SyncDataHolder> {
        await this.setClientID()
        const holder = await this.authHttp.get<SyncDataHolder>(AppConfig.scheme + AppConfig.apiUrl + `/api/latest-sync-data?includeDeleted=` + includeDeleted, { responseType: 'json', observe: 'body', headers: this.headers })
            .toPromise();

        holder.folders.forEach(folder => this.setDatesForFolder(folder))
        holder.notes.forEach(note => this.setDatesForNote(note))
        return Promise.resolve(holder);
    }

    async getAllFolders(includeDeleted: boolean): Promise<Folder[]> {
        await this.setClientID()
        const folders = await this.authHttp.get<Folder[]>(AppConfig.scheme + AppConfig.apiUrl + `/api/folders?includeDeleted=` + includeDeleted, { responseType: 'json', observe: 'body', headers: this.headers })
            .toPromise();

        folders.forEach(folder => this.setDatesForFolder(folder))

        return Promise.resolve(folders);
    }

    async getNotesInfo(): Promise<Note[]> {
        await this.setClientID()
        const notes = await this.authHttp.get<Note[]>(AppConfig.scheme + AppConfig.apiUrl + `/api/notesinfo`, { responseType: 'json', observe: 'body', headers: this.headers })
            .toPromise();

        notes.forEach(note => this.setDatesForNote(note))
        return Promise.resolve(notes);
    }

    async searchNotes(query: string, folderId: string) {
        await this.setClientID();
        let condition = 'query=' + query;
        if (folderId != null) {
            condition += '&folderId=' + folderId;
        }
        const notes = await this.authHttp.get<Note[]>(AppConfig.scheme + AppConfig.apiUrl + `/api/search-notes?` + condition, { responseType: 'json', observe: 'body', headers: this.headers })
            .toPromise();

        notes.forEach(note => this.setDatesForNote(note))
        return Promise.resolve(notes)
    }

    async getAllNotes(includeDeleted: boolean): Promise<Note[]> {
        await this.setClientID()
        const notes = await this.authHttp.get<Note[]>(AppConfig.scheme + AppConfig.apiUrl + `/api/notes`, { responseType: 'json', observe: 'body', headers: this.headers })
            .toPromise();

        notes.forEach(note => this.setDatesForNote(note))

        return Promise.resolve(notes);
    }

    async loadNotesByFolder(folderId: string): Promise<Note[]> {
        await this.setClientID()
        const notes = await this.authHttp.get<Note[]>(AppConfig.scheme + AppConfig.apiUrl + `/api/notes?folderId=` + folderId, { responseType: 'json', observe: 'body', headers: this.headers })
            .toPromise();

        notes.forEach(note => this.setDatesForNote(note))

        return Promise.resolve(notes);
    }

    async getFavoriteNotes(): Promise<Note[]> {
        await this.setClientID()
        const notes = await this.authHttp.get<Note[]>(AppConfig.scheme + AppConfig.apiUrl + `/api/favorite-notes`, { responseType: 'json', observe: 'body', headers: this.headers })
            .toPromise();

        notes.forEach(note => this.setDatesForNote(note))

        return Promise.resolve(notes);
    }

    async getRootFolder(): Promise<Folder> {
        await this.setClientID()
        let requestUrl = AppConfig.scheme + AppConfig.apiUrl + `/api/rootFolder`

        const folder = await this.authHttp.get<Folder>(requestUrl, { responseType: 'json', observe: 'body', headers: this.headers })
            .toPromise();

        this.setDatesForFolder(folder)

        return Promise.resolve(folder);
    }

    async addToFavorites(noteId: string) {
        await this.setClientID()
        await this.authHttp.post(AppConfig.scheme + AppConfig.apiUrl + `/api/add-to-favorites`, { "noteId": noteId }, { responseType: 'json', observe: 'body', headers: this.headers }).toPromise();
    }

    setDatesForFolder(folder: Folder) {
        folder.createdAt = new Date(folder.createdAt);
        folder.updatedAt = new Date(folder.updatedAt);
        if (folder.deletedAt != null) {
            folder.deletedAt = new Date(folder.deletedAt)
        }
    }

    setDatesForNote(note: Note) {
        note.createdAt = new Date(note.createdAt);
        note.updatedAt = new Date(note.updatedAt);
        if (note.deletedAt != null) {
            note.deletedAt = new Date(note.deletedAt)
        }
    }
}
