import { Manager, SyncService } from 'giganotes-core';
import { ipcMain } from 'electron';

export function initIpc(manager: Manager) {
  initSyncServiceIpc(manager.syncService);
}

function initSyncServiceIpc(syncService: SyncService) {
  ipcMain.on('sync-service-sync-request', (event, arg) => {
    syncService.doSync(arg['userId']).then(() => {
        event.reply('sync-service-sync-reply', {});
    });
});
}
