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

    constructor(private loggerSerivce: LoggerService,
        private authService: AuthService) {
    }

    isSyncing(): boolean {
        return this._isSyncing;
    }

    async doSync() {
        try {
            if (this._isSyncing) {
                return;
            }
            this.lastSyncDate = new Date();
            this._isSyncing = true;
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
