import { Manager, SyncService, Storage } from 'giganotes-core';
import { ipcMain } from 'electron';

export function initIpc(manager: Manager) {
  initSyncServiceIpc(manager.syncService);
  initStorageIpc(manager.storage);
}

function initSyncServiceIpc(syncService: SyncService) {
    ipcMain.on('sync-service-sync-request', (event, arg) => {
        syncService.doSync(arg['userId']).then(() => {
            event.reply('sync-service-sync-reply', {});
        });
    });
}

function initStorageIpc(storage: Storage) {
  ipcMain.on('storage-get-request', (event, arg) => {
      storage.get(arg).then(value => {
          event.reply('storage-get-reply', value);
      });
  });

  ipcMain.on('storage-set-request', (event, arg) => {
    storage.set(arg.key, arg.value).then(value => {
      event.reply('storage-set-reply', null);
    });
  });
}
