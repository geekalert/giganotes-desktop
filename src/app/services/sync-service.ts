import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';

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

    constructor(private loggerSerivce: LoggerService,
        private authService: AuthService) {
    }

    isSyncing(): boolean {
        return this._isSyncing;
    }

    async callSync(userId: number) {
        return new Promise(function (resolve, reject) {
            ipcRenderer.once('sync-service-sync-reply', (event, arg) => {
                resolve();
            });

            ipcRenderer.send('sync-service-sync-request', {
                userId: userId
            });
      });
    }

    async doSync() {
        try {
            if (this._isSyncing) {
                return;
            }
            this.lastSyncDate = new Date();
            this._isSyncing = true;
            this.callSync(this.authService.userId);
            this.subject.next({ type: 'success' })
        } catch (e) {
            console.log(e)
            this.subject.next({ type: 'error', message: 'Cannot connect to server' })
        } finally {
            this._isSyncing = false;
        }
    }


    getMessages(): Observable<any> {
        return this.subject.asObservable();
    }
}
