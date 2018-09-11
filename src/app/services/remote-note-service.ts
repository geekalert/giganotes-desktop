import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Note } from './../model/note';
import { Folder } from './../model/folder';
import { SyncDataHolder } from './../model/sync-data-holder';
import { AppConfig } from '../../environments/environment';
import { AuthService } from "../services/auth-service";
import { map } from "rxjs/operators";

@Injectable()
export class RemoteNoteService {

    requestOptions: RequestOptions;

    constructor(readonly authHttp: HttpClient,
                readonly authService: AuthService,
                private readonly jwtHelper: JwtHelperService) {
        const headers = new Headers()
        headers.append('ClientType', AppConfig.clientType);             
        this.requestOptions = new RequestOptions({headers : headers});                 
    }
    
    async setClientID() {
        const jwt = await this.authService.storage.get('jwt')
        const token = this.jwtHelper.decodeToken(jwt)
        this.requestOptions.headers.set("ClientID", token['jti'])
    }

    async saveNote(note: Note) {  
        await this.setClientID()      
        const response = await this.authHttp.post(AppConfig.apiUrl + `api/save-note`, note, this.requestOptions)
            .map(response => response.json())
            .toPromise();
        note.id = response;
    }    

    async saveFolder(folder: Folder) {
        await this.setClientID()      
        const response = await this.authHttp.post(AppConfig.apiUrl + `api/save-folder`, folder, this.requestOptions)
            .map(response => response.json())
            .toPromise();
        folder.id = response;
    }        
    
    async uploadNote(note: Note) {
        await this.setClientID()      
        await this.authHttp.post(AppConfig.apiUrl + `api/upload-note`, note, this.requestOptions).toPromise();        
    }    

    async updateNote(note: Note) {
        await this.setClientID()      
        await this.authHttp.post(AppConfig.apiUrl + `api/update-note`, note, this.requestOptions).toPromise();        
    }   

    async uploadFolder(folder: Folder) {
        await this.setClientID()
        await this.authHttp.post(AppConfig.apiUrl + `api/upload-folder`, folder, this.requestOptions).toPromise();        
    }    

    async updateFolder(folder: Folder) {
        await this.setClientID()
        await this.authHttp.post(AppConfig.apiUrl + `api/update-folder`, folder, this.requestOptions).toPromise();        
    }   

    async loadNoteById(id: string): Promise<Note> {
        await this.setClientID()
        const response = await this.authHttp.get(AppConfig.apiUrl + `api/note/` + id, this.requestOptions)
            .map(response => response.json())
            .toPromise();
        const note = new Note();
        note.id = response.id
        note.createdAt = new Date(response.createdAt)
        note.updatedAt = new Date(response.updatedAt)
        if (response.deletedAt != null) {
            note.deletedAt = new Date(response.deletedAt)
        }
        note.level = response.level
        note.title = response.title
        note.text = response.text
        note.folderId = response.folderId
        note.userId = response.userId
        return Promise.resolve(note)
    }

    async removeNote(id: string) {
        await this.setClientID()
        await this.authHttp.get(AppConfig.apiUrl + `api/remove-note/` + id, this.requestOptions).toPromise();
    }

    async removeFolder(id: string) {
        await this.setClientID()        
        await this.authHttp.get(AppConfig.apiUrl + `api/remove-folder/` + id, this.requestOptions).toPromise();
    }

    async loadFolderById(id: string): Promise<Folder> {
        await this.setClientID()        
        let requestUrl = AppConfig.apiUrl + `api/folder/` + id
 
        const response = await this.authHttp.get(requestUrl, this.requestOptions)
            .map(response => response.json())
            .toPromise();
        const folder = new Folder();
        folder.id = response.id
        folder.createdAt = new Date(response.createdAt)
        folder.updatedAt = new Date(response.updatedAt)
        if (response.deletedAt != null) {
            folder.deletedAt = new Date(response.deletedAt)
        }
        folder.title = response.title
        folder.level = response.level
        folder.parentId = response.parentId
        folder.userId = response.userId

        return Promise.resolve(folder);
    }

    async getLatestSyncData(includeDeleted: boolean): Promise<SyncDataHolder> {
        await this.setClientID()
        const response = await this.authHttp.get(AppConfig.apiUrl + `api/latest-sync-data?includeDeleted=` + includeDeleted, this.requestOptions)
            .map(response => response.json())
            .toPromise();
        
        const holder = new SyncDataHolder()

        holder.notes = Array<Note>();

        for(const n of response.notes) {
            const newNoteInfo = new Note();
            newNoteInfo.id = n.id
            newNoteInfo.createdAt = new Date(n.createdAt)
            newNoteInfo.updatedAt = new Date(n.updatedAt)
            if (n.deletedAt != null) {
                newNoteInfo.deletedAt = new Date(n.deletedAt)
            }
            newNoteInfo.folderId = n.folderId
            holder.notes.push(newNoteInfo)
        }

        holder.folders =  Array<Folder>();

        for(const f of response.folders) {
            const newFolder = new Folder();
            newFolder.id = f.id;
            newFolder.title = f.title;
            newFolder.createdAt = new Date(f.createdAt);
            newFolder.updatedAt = new Date(f.updatedAt);
            if (f.deletedAt != null) {
                newFolder.deletedAt = new Date(f.deletedAt)
            }
            newFolder.level = f.level;
            newFolder.parentId = f.parentId;
            newFolder.userId = f.userId
            holder.folders.push(newFolder)
        }

        return Promise.resolve(holder);
    }

    async getAllFolders(includeDeleted: boolean): Promise<Folder[]> {
        await this.setClientID()
        const folders = await this.authHttp.get(AppConfig.apiUrl + `api/folders?includeDeleted=` + includeDeleted, this.requestOptions)
            .map(response => response.json())
            .toPromise();

        const result = Array<Folder>();
        for(const f of folders) {
            const newFolder = new Folder();
            newFolder.id = f.id;
            newFolder.title = f.title;
            newFolder.createdAt = new Date(f.createdAt);
            newFolder.updatedAt = new Date(f.updatedAt);
            if (f.deletedAt != null) {
                newFolder.deletedAt = new Date(f.deletedAt)
            }
            newFolder.level = f.level;
            newFolder.parentId = f.parentId;
            newFolder.userId = f.userId
            result.push(newFolder)
        }
        
        return Promise.resolve(result);
    }    
    
    async getNotesInfo(): Promise<Note[]> {
        await this.setClientID()
        const notes =  await this.authHttp.get(AppConfig.apiUrl + `api/notesinfo`, this.requestOptions)
            .map(response => response.json())
            .toPromise();

        const result = Array<Note>();

        for(const n of notes) {
            const newNoteInfo = new Note();
            newNoteInfo.id = n.id
            newNoteInfo.createdAt = new Date(n.createdAt)
            newNoteInfo.updatedAt = new Date(n.updatedAt)
            if (n.deletedAt != null) {
                newNoteInfo.deletedAt = new Date(n.deletedAt)
            }
            result.push(newNoteInfo)
        }
        return Promise.resolve(result);
    }

    async searchNotes(query: string) {
        await this.setClientID()
        const response = await this.authHttp.get(AppConfig.apiUrl + `api/search-notes?query=` + query, this.requestOptions)
            .map(response => response.json())
            .toPromise();

        const notes = Array<Note>();

        for (const n of response) {
            const note = new Note();
            note.id = n.id
            note.createdAt = new Date(n.createdAt)
            note.updatedAt = new Date(n.updatedAt)
            note.level = n.level
            note.title = n.title
            note.text = n.text
            note.folderId = n.folderId
            note.userId = n.userId
            notes.push(note)
        }

        return Promise.resolve(notes)
    }

    async anotherAppUpdate(): Promise<Date> {
        await this.setClientID()
        const response = await this.authHttp.get(AppConfig.apiUrl + `api/another-app-update`, this.requestOptions)
            .map(response => response.json())
            .toPromise();     

        if (response == "") {
            return null
        }
        return new Date(response.createdAt)
    }    
}
