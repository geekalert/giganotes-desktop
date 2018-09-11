import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer } from 'electron';
import { remote } from 'electron';

import * as childProcess from 'child_process';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;
  remote: typeof remote;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.remote = window.require('electron').remote;
      this.childProcess = window.require('child_process');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  getUserDataPath() : string {
    return this.remote.app.getPath('userData')
  }

}
