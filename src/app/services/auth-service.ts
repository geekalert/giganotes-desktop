import { Injectable } from "@angular/core";
import { AuthResponse } from '../model/server-responses-models/auth-response';
import { ipcRenderer } from 'electron';

@Injectable()
export class AuthService {

  isOffline(): Promise<boolean> {
    const promise = new Promise<boolean>(function (resolve, reject) {
      ipcRenderer.once('auth-service-isoffline-reply', (event, arg) => {
          resolve(arg);
      });
    });

    ipcRenderer.send('auth-service-isoffline-request', null);
    return promise;
  }

  loginType(): Promise<string> {
    const promise = new Promise<string>(function (resolve, reject) {
      ipcRenderer.once('auth-service-logintype-reply', (event, arg) => {
          resolve(arg);
      });
    });

    ipcRenderer.send('auth-service-logintype-request', null);
    return promise;
  }

  async hasValidToken(): Promise<boolean> {
    const promise = new Promise<boolean>(function (resolve, reject) {
      ipcRenderer.once('auth-service-hasvalidtoken-reply', (event, arg) => {
          resolve(arg);
      });
    });

    ipcRenderer.send('auth-service-hasvalidtoken-request', null);
    return promise;
  }

  async login(values: any): Promise<AuthResponse> {
    const promise = new Promise<AuthResponse>(function (resolve, reject) {
      ipcRenderer.once('auth-service-login-reply', (event, arg) => {
          resolve(arg);
      });
    });

    ipcRenderer.send('auth-service-login-request', values);
    return promise;
  }

  async loginSocial(values: any): Promise<AuthResponse> {
    const promise = new Promise<AuthResponse>(function (resolve, reject) {
      ipcRenderer.once('auth-service-loginsocial-reply', (event, arg) => {
          resolve(arg);
      });
    });

    ipcRenderer.send('auth-service-loginsocial-request', values);
    return promise;
  }

  async logout() {
    const promise = new Promise<AuthResponse>(function (resolve, reject) {
      ipcRenderer.once('auth-service-logout-reply', (event, arg) => {
          resolve();
      });
    });

    ipcRenderer.send('auth-service-logout-request', null);
    return promise;
  }

  async signup(values: any): Promise<AuthResponse> {
    const promise = new Promise<AuthResponse>(function (resolve, reject) {
      ipcRenderer.once('auth-service-signup-reply', (event, arg) => {
          resolve(arg);
      });
    });

    ipcRenderer.send('auth-service-signup-request', values);
    return promise;
  }


  async readTokenAndUserameFromStorage(): Promise<any> {
    return null;
  }

  async loginOffline() {
    const promise = new Promise<AuthResponse>(function (resolve, reject) {
      ipcRenderer.once('auth-service-loginoffline-reply', (event, arg) => {
          resolve();
      });
    });

    ipcRenderer.send('auth-service-loginoffline-request', null);
    return promise;
  }
}


