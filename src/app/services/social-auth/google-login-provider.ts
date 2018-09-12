import { BaseLoginProvider } from './base-login-provider';
import { SocialUser } from './../../model/social-auth/social-user';
import { LoginOpt } from './social-auth-service';
import { OAuth2Provider } from 'electron-oauth-helper';
import { remote } from 'electron'
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { GoogleAuthResponse } from './../../model/server-responses-models/google-auth-response';

export class GoogleLoginProvider extends BaseLoginProvider {

  public static readonly PROVIDER_ID: string = 'GOOGLE';

  protected auth2: any;

  constructor(private http: HttpClient, private clientId: string, private opt: LoginOpt = { scope: 'email' }) { super(); }

  initialize(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
    });
  }

  signIn(opt?: LoginOpt): Promise<SocialUser> {
    const http = this.http
    return new Promise((resolve, reject) => {
      const window = new remote.BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
          nodeIntegration: false, // We recommend disabling nodeIntegration for security.
          contextIsolation: true // We recommend enabling contextIsolation for security.
        },
      })

      const config = {
        client_id: this.clientId,
        redirect_uri: "http://localhost",
        authorize_url: "https://accounts.google.com/o/oauth2/v2/auth",
        response_type: "token id_token",
        scope: this.opt.scope
      }
      const provider = new OAuth2Provider(config)
        .withCustomAuthorizationRequestParameter({ nonce: "n-0S6_WzA2Mj" })

      provider.perform(window)
        .then(resp => {
          const headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + resp.access_token);

          http.get<GoogleAuthResponse>('https://www.googleapis.com/oauth2/v3/userinfo',
            { responseType: 'json', observe: 'body', headers: headers })
            .toPromise<GoogleAuthResponse>().then((rq: GoogleAuthResponse) => {
              const user = new SocialUser()
              user.email = rq.email
              user.idToken = resp.id_token
              resolve(user)
              window.close();
            }).catch(error => {
              reject(error)
            })
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  signOut(): Promise<any> {
    return new Promise((resolve, reject) => {
    });
  }

  revokeAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
    });
  }

}