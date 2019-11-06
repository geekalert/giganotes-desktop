import { Manager, SyncService, Storage, NoteManagerService, AuthService } from 'giganotes-core';
import { ipcMain } from 'electron';

export function initIpc(manager: Manager) {
  initAuthServiceIpc(manager.authService);
  initSyncServiceIpc(manager.syncService);
  initStorageIpc(manager.storage);
  initNoteServiceRpc(manager.noteManagerService);
}

function initAuthServiceIpc(authService: AuthService) {
  ipcMain.on('auth-service-login-request', (event, arg) => {
    authService.login(arg).then(authResponse => {
        event.sender.send('auth-service-login-reply', authResponse);
    });
  });

  ipcMain.on('auth-service-loginsocial-request', (event, arg) => {
    authService.loginSocial(arg).then(authResponse => {
        event.sender.send('auth-service-loginsocial-reply', authResponse);
    });
  });

  ipcMain.on('auth-service-loginoffline-request', (event, arg) => {
    authService.loginOffline().then(() => {
        event.sender.send('auth-service-loginoffline-reply', {});
    });
  });

  ipcMain.on('auth-service-logout-request', (event, arg) => {
    authService.logout().then(() => {
        event.sender.send('auth-service-logoit-reply', {});
    });
  });

  ipcMain.on('auth-service-signup-request', (event, arg) => {
    authService.signup(arg).then(authResponse => {
        event.sender.send('auth-service-signup-reply', authResponse);
    });
  });

  ipcMain.on('auth-service-hasvalidtoken-request', (event, arg) => {
    authService.hasValidToken().then(hasValidToken => {
        event.sender.send('auth-service-hasvalidtoken-reply', hasValidToken);
    });
  });

  ipcMain.on('auth-service-isoffline-request', (event, arg) => {
      event.sender.send('auth-service-isoffline-reply', authService.isOffline);
  });

  ipcMain.on('auth-service-logintype-request', (event, arg) => {
    event.sender.send('auth-service-logintype-reply', authService.loginType);
});
}

function initSyncServiceIpc(syncService: SyncService) {
    ipcMain.on('sync-service-sync-request', (event, arg) => {
        syncService.doSync().then(() => {
            event.sender.send('sync-service-sync-reply', {});
        });
    });
}

function initStorageIpc(storage: Storage) {
  ipcMain.on('storage-get-request', (event, arg) => {
      storage.get(arg).then(value => {
          event.sender.send('storage-get-reply', value);
      });
  });

  ipcMain.on('storage-set-request', (event, arg) => {
    storage.set(arg.key, arg.value).then(value => {
      event.sender.send('storage-set-reply', null);
    });
  });

  ipcMain.on('storage-remove-request', (event, arg) => {
    storage.remove(arg.key).then(value => {
      event.sender.send('storage-remove-reply', null);
    });
  });

  ipcMain.on('storage-clear-request', (event, arg) => {
    storage.clear().then(value => {
      event.sender.send('storage-clear-reply', null);
    });
  });
}

function initNoteServiceRpc(noteService: NoteManagerService) {

  ipcMain.on('note-manager-service-createfolder-request', (event, arg) => {
    noteService.createFolder(arg['title'], arg['parentFolderId']).then(folder => {
        event.sender.send('note-manager-service-createfolder-reply', folder);
    });
  });

  ipcMain.on('note-manager-service-createnote-request', (event, arg) => {
    noteService.createNote(arg['title'], arg['text'], arg['currentFolderId']).then(note => {
        event.sender.send('note-manager-service-createnote-reply', note);
    });
  });

  ipcMain.on('note-manager-service-getallnotes-request', (event, arg) => {
    noteService.getAllNotes().then(notes => {
        event.sender.send('note-manager-service-getallnotes-reply', notes);
    });
  });

  ipcMain.on('note-manager-service-getallfolders-request', (event, arg) => {
    noteService.getAllFolders().then(folders => {
        event.sender.send('note-manager-service-getallfolders-reply', folders);
    });
  });

  ipcMain.on('note-manager-service-getrootfolder-request', (event, arg) => {
    noteService.getRootFolder().then(rootFolder => {
        event.sender.send('note-manager-service-getrootfolder-reply', rootFolder);
    });
  });

  ipcMain.on('note-manager-service-loadnotebyid-request', (event, arg) => {
    noteService.loadNoteById(arg['id']).then(note => {
        event.sender.send('note-manager-service-loadnotebyid-reply', note);
    });
  });

  ipcMain.on('note-manager-service-loadfolderbyid-request', (event, arg) => {
    noteService.loadFolderById(arg['id']).then(folder => {
        event.sender.send('note-manager-service-loadfolderbyid-reply', folder);
    });
  });

  ipcMain.on('note-manager-service-loadfolderwithactualchildren-request', (event, arg) => {
    noteService.loadFolderWithActualChildren(arg['id']).then(folder => {
        event.sender.send('note-manager-service-loadfolderwithactualchildren-reply', folder);
    });
  });

  ipcMain.on('note-manager-service-loadnotesbyfolder-request', (event, arg) => {
    noteService.loadNotesByFolder(arg['folderId']).then(folder => {
        event.sender.send('note-manager-service-loadnotesbyfolder-reply', folder);
    });
  });

  ipcMain.on('note-manager-service-hasfolderwithid-request', (event, arg) => {
    noteService.hasFolderWithId(arg['id']).then(hasFolder => {
        event.sender.send('note-manager-service-hasfolderwithid-reply', hasFolder);
    });
  });

  ipcMain.on('note-manager-service-removefolder-request', (event, arg) => {
    noteService.removeFolder(arg['id']).then(() => {
        event.sender.send('note-manager-service-removefolder-reply', null);
    });
  });

  ipcMain.on('note-manager-service-removenote-request', (event, arg) => {
    noteService.removeNote(arg['id']).then(() => {
        event.sender.send('note-manager-service-removenote-reply', null);
    });
  });

  ipcMain.on('note-manager-service-updatefolder-request', (event, arg) => {
    noteService.updateFolder(arg['id']).then(() => {
        event.sender.send('note-manager-service-updatefolder-reply', null);
    });
  });

  ipcMain.on('note-manager-service-updatenote-request', (event, arg) => {
    noteService.updateNote(arg['id']).then(() => {
        event.sender.send('note-manager-service-updatenote-reply', null);
    });
  });
}
