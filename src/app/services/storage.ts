import { ipcRenderer } from 'electron';
import { Injectable } from '@angular/core';

@Injectable()
export class Storage {


    async get(key: string): Promise<any> {
      const promise = new Promise(function (resolve, reject) {
        ipcRenderer.once('storage-get-reply', (event, arg) => {
            resolve(arg);
        });
      });

      ipcRenderer.send('storage-get-request', key);
      return promise;
    }

    async set(key: string, value: any): Promise<void> {
      const promise = new Promise<void>(function (resolve, reject) {
        ipcRenderer.once('storage-set-reply', (event, arg) => {
            resolve();
        });
      });

      ipcRenderer.send('storage-set-request', {
        key: key,
        value: value
      });

      return promise;
    }

    async remove(key: string): Promise<void>  {
    }

    async clear(): Promise<void> {
    }
}
