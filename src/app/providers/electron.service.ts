import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { remote } from 'electron';

@Injectable()
export class ElectronService {

  remote: typeof remote;
  addon: any;

  constructor() {
      this.remote = window.require('electron').remote;
      this.addon = window.require('nativeaddon');

  }

  fibo() {
    return this.addon.fibo();
  }

  getUserDataPath() : string {
    return this.remote.app.getPath('userData')
  }
}
