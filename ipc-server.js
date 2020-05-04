"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
function initIpc(manager) {
    initAuthServiceIpc(manager.authService);
    initSyncServiceIpc(manager.syncService);
    initStorageIpc(manager.storage);
    initNoteServiceRpc(manager.noteManagerService);
}
exports.initIpc = initIpc;
function initAuthServiceIpc(authService) {
    electron_1.ipcMain.on('auth-service-login-request', function (event, arg) {
        authService.login(arg).then(function (authResponse) {
            event.sender.send('auth-service-login-reply', authResponse);
        });
    });
    electron_1.ipcMain.on('auth-service-loginsocial-request', function (event, arg) {
        authService.loginSocial(arg).then(function (authResponse) {
            event.sender.send('auth-service-loginsocial-reply', authResponse);
        });
    });
    electron_1.ipcMain.on('auth-service-loginoffline-request', function (event, arg) {
        authService.loginOffline().then(function () {
            event.sender.send('auth-service-loginoffline-reply', {});
        });
    });
    electron_1.ipcMain.on('auth-service-logout-request', function (event, arg) {
        authService.logout().then(function () {
            event.sender.send('auth-service-logout-reply', {});
        });
    });
    electron_1.ipcMain.on('auth-service-signup-request', function (event, arg) {
        authService.signup(arg).then(function (authResponse) {
            event.sender.send('auth-service-signup-reply', authResponse);
        });
    });
    electron_1.ipcMain.on('auth-service-hasvalidtoken-request', function (event, arg) {
        authService.hasValidToken().then(function (hasValidToken) {
            event.sender.send('auth-service-hasvalidtoken-reply', hasValidToken);
        });
    });
    electron_1.ipcMain.on('auth-service-isoffline-request', function (event, arg) {
        event.sender.send('auth-service-isoffline-reply', authService.isOffline);
    });
    electron_1.ipcMain.on('auth-service-email-request', function (event, arg) {
        event.sender.send('auth-service-email-reply', authService.email);
    });
    electron_1.ipcMain.on('auth-service-logintype-request', function (event, arg) {
        event.sender.send('auth-service-logintype-reply', authService.loginType);
    });
}
function initSyncServiceIpc(syncService) {
    electron_1.ipcMain.on('sync-service-sync-request', function (event, arg) {
        syncService.doSync().then(function () {
            event.sender.send('sync-service-sync-reply', {});
        });
    });
}
function initStorageIpc(storage) {
    electron_1.ipcMain.on('storage-get-request', function (event, arg) {
        storage.get(arg).then(function (value) {
            event.sender.send('storage-get-reply', value);
        });
    });
    electron_1.ipcMain.on('storage-set-request', function (event, arg) {
        storage.set(arg.key, arg.value).then(function (value) {
            event.sender.send('storage-set-reply', null);
        });
    });
    electron_1.ipcMain.on('storage-remove-request', function (event, arg) {
        storage.remove(arg.key).then(function (value) {
            event.sender.send('storage-remove-reply', null);
        });
    });
    electron_1.ipcMain.on('storage-clear-request', function (event, arg) {
        storage.clear().then(function (value) {
            event.sender.send('storage-clear-reply', null);
        });
    });
}
function initNoteServiceRpc(noteService) {
    electron_1.ipcMain.on('note-manager-service-login-request', function (event, arg) {
        noteService.login(arg).then(function (authResponse) {
            event.sender.send('note-manager-service-login-reply', authResponse);
        });
    });
    electron_1.ipcMain.on('note-manager-service-loginsocial-request', function (event, arg) {
        noteService.loginSocial(arg).then(function (authResponse) {
            event.sender.send('note-manager-service-loginsocial-reply', authResponse);
        });
    });
    electron_1.ipcMain.on('note-manager-service-signup-request', function (event, arg) {
        noteService.signup(arg).then(function (authResponse) {
            event.sender.send('note-manager-service-signup-reply', authResponse);
        });
    });
    electron_1.ipcMain.on('note-manager-service-createfolder-request', function (event, arg) {
        noteService.createFolder(arg['title'], arg['parentFolderId']).then(function (folder) {
            event.sender.send('note-manager-service-createfolder-reply', folder);
        });
    });
    electron_1.ipcMain.on('note-manager-service-createnote-request', function (event, arg) {
        noteService.createNote(arg['title'], arg['text'], arg['currentFolderId']).then(function (note) {
            event.sender.send('note-manager-service-createnote-reply', note);
        });
    });
    electron_1.ipcMain.on('note-manager-service-getallnotes-request', function (event, arg) {
        noteService.getAllNotes().then(function (notes) {
            event.sender.send('note-manager-service-getallnotes-reply', notes);
        });
    });
    electron_1.ipcMain.on('note-manager-service-getallfolders-request', function (event, arg) {
        noteService.getAllFolders().then(function (folders) {
            event.sender.send('note-manager-service-getallfolders-reply', folders);
        });
    });
    electron_1.ipcMain.on('note-manager-service-getrootfolder-request', function (event, arg) {
        noteService.getRootFolder().then(function (rootFolder) {
            event.sender.send('note-manager-service-getrootfolder-reply', rootFolder);
        });
    });
    electron_1.ipcMain.on('note-manager-service-loadnotebyid-request', function (event, arg) {
        noteService.loadNoteById(arg['id']).then(function (note) {
            event.sender.send('note-manager-service-loadnotebyid-reply', note);
        });
    });
    electron_1.ipcMain.on('note-manager-service-loadfolderbyid-request', function (event, arg) {
        noteService.loadFolderById(arg['id']).then(function (folder) {
            event.sender.send('note-manager-service-loadfolderbyid-reply', folder);
        });
    });
    electron_1.ipcMain.on('note-manager-service-loadfolderwithactualchildren-request', function (event, arg) {
        noteService.loadFolderWithActualChildren(arg['id']).then(function (folder) {
            event.sender.send('note-manager-service-loadfolderwithactualchildren-reply', folder);
        });
    });
    electron_1.ipcMain.on('note-manager-service-loadnotesbyfolder-request', function (event, arg) {
        noteService.loadNotesByFolder(arg['folderId']).then(function (folder) {
            event.sender.send('note-manager-service-loadnotesbyfolder-reply', folder);
        });
    });
    electron_1.ipcMain.on('note-manager-service-hasfolderwithid-request', function (event, arg) {
        noteService.hasFolderWithId(arg['id']).then(function (hasFolder) {
            event.sender.send('note-manager-service-hasfolderwithid-reply', hasFolder);
        });
    });
    electron_1.ipcMain.on('note-manager-service-removefolder-request', function (event, arg) {
        noteService.removeFolder(arg['id']).then(function () {
            event.sender.send('note-manager-service-removefolder-reply', null);
        });
    });
    electron_1.ipcMain.on('note-manager-service-removenote-request', function (event, arg) {
        noteService.removeNote(arg['id']).then(function () {
            event.sender.send('note-manager-service-removenote-reply', null);
        });
    });
    electron_1.ipcMain.on('note-manager-service-updatefolder-request', function (event, folder) {
        setDatesForFolder(folder);
        noteService.updateFolder(folder).then(function () {
            event.sender.send('note-manager-service-updatefolder-reply', null);
        });
    });
    electron_1.ipcMain.on('note-manager-service-updatenote-request', function (event, note) {
        setDatesForNote(note);
        noteService.updateNote(note).then(function () {
            event.sender.send('note-manager-service-updatenote-reply', null);
        });
    });
}
function setDatesForFolder(folder) {
    folder.createdAt = new Date(folder.createdAt);
    folder.updatedAt = new Date(folder.updatedAt);
    if (folder.deletedAt != null) {
        folder.deletedAt = new Date(folder.deletedAt);
    }
}
function setDatesForNote(note) {
    note.createdAt = new Date(note.createdAt);
    note.updatedAt = new Date(note.updatedAt);
    if (note.deletedAt != null) {
        note.deletedAt = new Date(note.deletedAt);
    }
}
//# sourceMappingURL=ipc-server.js.map