import { Injectable } from '@angular/core';
import { Note } from '../model/note';
import { Folder } from '../model/folder';
import { ipcRenderer } from 'electron';

@Injectable()
export class NoteManagerService {

    constructor() {
    }

    async createFolder(title: string, parentFolderId: string): Promise<Folder> {
      const promise = new Promise<Folder>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-createfolder-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-createfolder-request', {'title' : title, 'parentFolderId' : parentFolderId});
      return promise;
    }

    async createNote(title: string, text: string, currentFolderId: string): Promise<Note> {
      const promise = new Promise<Note>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-createfolder-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-createfolder-request', {'title' : title, 'text' : text, 'currentFolderId' : currentFolderId});
      return promise;
    }


    async uploadNote(note: Note) {
      const promise = new Promise(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-uploadnote-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-uploadnote-request', note);
      return promise;
    }

    async updateNote(note: Note) {
      const promise = new Promise(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-updatenote-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-updatenote-request', note);
      return promise;
    }

    async uploadFolder(folder: Folder) {
      const promise = new Promise(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-uploadfolder-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-uploadfolder-request', folder);
      return promise;
    }

    async hasFolderWithId(id: string): Promise<boolean> {
      const promise = new Promise<boolean>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-hasfolderwithid-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-hasfolderwithid-request', { id: id });
      return promise;
    }

    async updateFolder(folder: Folder) {
      const promise = new Promise(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-updatenote-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-updatenote-request', folder);
      return promise;
    }

    async loadNoteById(id: string): Promise<Note> {
      const promise = new Promise<Note>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-loadnotebyid-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-loadnotebyid-request', { id: id });
      return promise;
    }

    async removeNote(id: string) {
      const promise = new Promise(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-removenote-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-removenote-request', { id: id});
      return promise;
    }

    async removeFolder(id: string) {
      const promise = new Promise(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-removefolder-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-removefolder-request', { id: id});
      return promise;
    }

    // Shold be used in offline mode only.
    async createRootFolderIfNotExists() {
      const promise = new Promise<void>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-createrootfolder-reply', (event, arg) => {
            resolve();
        });
      });

      ipcRenderer.send('note-manager-service-createrootfolder-request', null);
      return promise;
    }

    async getRootFolder(): Promise<Folder> {
      const promise = new Promise<Folder>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-getrootfolder-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-getrootfolder-request', null);
      return promise;
    }

    async loadFolderById(id: string): Promise<Folder> {
      const promise = new Promise<Folder>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-loadfolderbyid-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-loadfolderbyid-request', { id: id });
      return promise;
    }

    async loadNotesByFolder(folderId: string): Promise<Note[]> {
      const promise = new Promise<Note[]>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-loadnotesbyfolder-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-loadnotesbyfolder-request', { folderId: folderId });
      return promise;
    }

    async loadFolderWithActualChildren(id: string): Promise<Folder> {
      const promise = new Promise<Folder>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-loadfolderwithactualchildren-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-loadfolderwithactualchildren-request', { id: id });
      return promise;
    }

    async getAllNotes(): Promise<Note[]> {
      const promise = new Promise<Note[]>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-getallnotes-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-getallnotes-request', {});
      return promise;
    }

    async getAllFolders(): Promise<Folder[]> {
      const promise = new Promise<Folder[]>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-getallfolders-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('note-manager-service-getallfolders-request', {});
      return promise;
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
