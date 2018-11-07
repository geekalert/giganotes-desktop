import { Injectable } from '@angular/core';
import { LocalNoteService } from './local-note-service';
import { AuthService } from './auth-service';

@Injectable()
export class DataService {
    constructor(private localNoteService: LocalNoteService,
                private authService: AuthService) {
    }
}