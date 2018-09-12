import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LocalNoteService } from './local-note-service';
import { AuthService } from './auth-service';
import { Note } from './../model/note';
import { Folder } from './../model/folder';
import { RemoteNoteService } from './remote-note-service';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { LoggerService } from './logger-service';

@Injectable()
export class SyncService {

    private subject = new Subject<any>();
    private _isSyncing = false;

    public lastSyncDate: Date = null;

    constructor(private localNoteService: LocalNoteService,
        private loggerSerivce: LoggerService,
        private remoteNoteService: RemoteNoteService,
        private authService: AuthService) {
    }

    isSyncing(): boolean {
        return this._isSyncing;
    }

    async doSync() {
        try {
            this.lastSyncDate = new Date();
            this._isSyncing = true;
            const syncData = await this.remoteNoteService.getLatestSyncData(true);
            await this.syncFolders(syncData.folders);
            await this.syncNotes(syncData.notes);
            this.subject.next({ type: 'success' })
        } catch (e) {
            this.subject.next({ type: 'error', message: 'Cannot connect to server' })
        } finally {
            this._isSyncing = false;
        }
    }

    async syncNotes(notesRemoteInfoList: Array<Note>) {
        const notesRemoteInfoMap = new Map<string, Note>();
        const updateNotesList = new Array<Note>();
        const uploadNotesList = new Array<Note>();

        for (const remoteNoteInfo of notesRemoteInfoList) {
            notesRemoteInfoMap.set(remoteNoteInfo.id, remoteNoteInfo)
            const localNote = await this.localNoteService.loadNoteById(remoteNoteInfo.id);
            if (localNote != null) {
                this.loggerSerivce.info('Note with id' + localNote.id + ' found locally')
                if (remoteNoteInfo.deletedAt != null && localNote.deletedAt == null) {
                    this.loggerSerivce.info('Note with id' + localNote.id + ' deleted remotely, updating locally')
                    const remoteNote = await this.remoteNoteService.loadNoteById(remoteNoteInfo.id)
                    await this.localNoteService.updateNote(remoteNote);
                } else if (remoteNoteInfo.deletedAt == null && localNote.deletedAt != null) {
                    this.loggerSerivce.info('Note with id' + localNote.id + ' deleted locally, pushing to updates list')
                    updateNotesList.push(localNote)
                } else if (remoteNoteInfo.updatedAt > localNote.updatedAt) {
                    const remoteNote = await this.remoteNoteService.loadNoteById(remoteNoteInfo.id)
                    await this.localNoteService.updateNote(remoteNote);
                } else if (remoteNoteInfo.updatedAt < localNote.updatedAt) {
                    updateNotesList.push(localNote)
                }
            } else {
                // We get here if there is no corresponding note in local database yet.
                // Ensure that the note is not deleted remotely. It does not make sence to download it to local database
                if (remoteNoteInfo.deletedAt == null) {
                    // Get full note info from remote server and save it locally
                    const remoteNote = await this.remoteNoteService.loadNoteById(remoteNoteInfo.id)
                    await this.localNoteService.uploadNote(remoteNote);
                }
            }
        }

        // Update the nessessary notes
        for (const updatedNote of updateNotesList) {
            await this.remoteNoteService.updateNote(updatedNote)
        }

        const localNotesList = await this.localNoteService.getAllNotes(false);

        for (const localNote of localNotesList) {
            if (!notesRemoteInfoMap.has(localNote.id)) {
                uploadNotesList.push(localNote)
            }
        }

        // Sort notes for upload by level
        uploadNotesList.sort((a, b) => b.level - a.level)

        for (const uploadedNote of uploadNotesList) {
            await this.remoteNoteService.uploadNote(uploadedNote)
        }
    }

    async syncFolders(remoteFoldersList: Array<Folder>) {
        const foldersRemoteMap = new Map<string, Folder>();
        const updateFoldersList = new Array<Folder>();
        const uploadFoldersList = new Array<Folder>();

        for (const remoteFolderInfo of remoteFoldersList) {
            foldersRemoteMap.set(remoteFolderInfo.id, remoteFolderInfo)
            const localFolder = await this.localNoteService.loadFolderById(remoteFolderInfo.id);
            if (localFolder != null) {
                this.loggerSerivce.info('Folder with id' + localFolder.id + ' found locally')
                if (remoteFolderInfo.deletedAt != null && localFolder.deletedAt == null) {
                    const remoteFolder = await this.remoteNoteService.loadFolderById(remoteFolderInfo.id)
                    this.loggerSerivce.info('Folder with id' + localFolder.id + ' deleted on the server, updating locally')
                    await this.localNoteService.updateFolder(remoteFolder);
                } else if (localFolder.deletedAt != null && remoteFolderInfo.deletedAt == null) {
                    this.loggerSerivce.info('Folder with id' + localFolder.id + ' deleted locally, pushing to updates list')
                    updateFoldersList.push(localFolder)
                } else if (remoteFolderInfo.updatedAt > localFolder.updatedAt) {
                    const remoteFolder = await this.remoteNoteService.loadFolderById(remoteFolderInfo.id)
                    await this.localNoteService.updateFolder(remoteFolder);
                } else if (remoteFolderInfo.updatedAt < localFolder.updatedAt) {
                    updateFoldersList.push(localFolder)
                }
            } else {
                await this.localNoteService.uploadFolder(remoteFolderInfo);
            }
        }

        // Update the nessessary folders
        for (const updatedFolder of updateFoldersList) {
            await this.remoteNoteService.updateFolder(updatedFolder)
        }

        // Discover all folders that does not existon the server.
        // We will not upload notes deleted locally
        const localFoldersList = await this.localNoteService.getAllFolders(false);

        for (const localFolder of localFoldersList) {
            if (!foldersRemoteMap.has(localFolder.id)) {
                uploadFoldersList.push(localFolder)
            }
        }

        // Sort folders for upload by level
        uploadFoldersList.sort((a, b) => b.level - a.level)

        for (const uploadedFolder of uploadFoldersList) {
            this.remoteNoteService.uploadFolder(uploadedFolder)
        }
    }

    getMessages(): Observable<any> {
        return this.subject.asObservable();
    }
}
