import {Injectable} from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Storage } from "../services/storage";
import { AppConfig } from '../../environments/environment';
import { LoggerService } from "./logger-service";
import { RequestOptions, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class AuthService {

  public isOffline: boolean;
  public jwtToken: string;
  public userId: number;
  public email: string;
  public loginType: string;

  requestOptions: any;

  constructor(private readonly http: HttpClient,
              public readonly storage: Storage,
              private readonly jwtHelper: JwtHelperService,
              private readonly loggerService: LoggerService) {
      const headers = new HttpHeaders()
      headers.append('ClientType', AppConfig.clientType);
      this.requestOptions = {headers : headers};
  }

  async hasValidToken(): Promise<boolean> {    
    this.isOffline = await this.storage.get('offline') === '1'
    if (this.isOffline) {
        return true
    }
    const jwt = await this.storage.get('jwt')
    return ((jwt != null) && !this.jwtHelper.isTokenExpired(jwt))
  }
  
  async login(values: any) : Promise<any> {
    const json = await this.http.post(AppConfig.apiUrl + `login`, values).toPromise()
    await this.storeTokenAndUsername(json.token, json.userId, values.email, 'internal')
    return json
  }

  async loginSocial(values: any) : Promise<any> {
    const json = await this.http.post(AppConfig.apiUrl + `login-social`, values, this.requestOptions)
      .pipe(map(response => response.json())).toPromise()
    await this.storeTokenAndUsername(json.token, json.userId, values.email, 'social')
    return json
  }

  async logout() {
    await this.storage.remove('jwt');
    await this.storage.remove('userId');
    await this.storage.remove('email');
    await this.storage.remove('loginType')
    await this.storage.remove('offline')
    this.isOffline = false
  }

  async signup(values: any): Promise<any> {
    const json = await this.http.post(AppConfig.apiUrl + `register`, values, this.requestOptions)
    .pipe(map(response => response.json())).toPromise()      
    if (json.token != null) {
       await this.storeTokenAndUsername(json.token, json.userId, values.email, 'internal');
    } 
    return json
  }
  
  async storeTokenAndUsername(jwt: string, userId: number, email: string, loginType: string): Promise<any> {
    await this.storage.set('jwt', jwt)
    await this.storage.set('userId', userId)
    await this.storage.set('email', email)
    await this.storage.set('loginType', loginType)
    this.keepTokenAndUsername(jwt, userId, email, loginType)
  }

  async readTokenAndUserameFromStorage() : Promise<any> {
    if (this.isOffline) {
      this.keepTokenAndUsername("", 4294967295, "offline-user@giganotes.com", 'offline')
      return
    } else {
      const jwt = await this.storage.get('jwt')
      const userId = parseInt(await this.storage.get('userId'))
      const email = await this.storage.get('email')
      const loginType = await this.storage.get('loginType')
      this.keepTokenAndUsername(jwt, userId, email, loginType)
    }
  }

  keepTokenAndUsername(jwt: string, userId: number, email: string, loginType: string) {
    this.jwtToken = jwt;
    this.userId = userId;
    this.email = email;
    this.loginType = loginType;
  }

  async loginOffline() {
    await this.storage.set('offline', 1)
  }  
}


