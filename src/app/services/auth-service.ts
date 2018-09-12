import {Injectable} from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Storage } from "../services/storage";
import { AppConfig } from '../../environments/environment';
import { LoggerService } from "./logger-service";
import { HttpHeaders } from '@angular/common/http';
import { AuthResponse} from '../model/server-responses-models/auth-response';

@Injectable()
export class AuthService {

  public isOffline: boolean;
  public jwtToken: string;
  public userId: number;
  public email: string;
  public loginType: string;
  public headers: HttpHeaders;
  requestOptions: any;

  constructor(private readonly http: HttpClient,
              public readonly storage: Storage,
              private readonly jwtHelper: JwtHelperService,
              private readonly loggerService: LoggerService) {
      this.headers = new HttpHeaders()
              .set('ClientType', AppConfig.clientType);
  }

  async hasValidToken(): Promise<boolean> {    
    this.isOffline = await this.storage.get('offline') === '1'
    if (this.isOffline) {
        return true
    }
    const jwt = await this.storage.get('jwt')
    return ((jwt != null) && !this.jwtHelper.isTokenExpired(jwt))
  }
  
  async login(values: any): Promise<AuthResponse> {
    const authResponse = await this.http.post<AuthResponse>(AppConfig.apiUrl + `login`, values,
                          {responseType : 'json', observe: 'body', headers: this.headers}).toPromise<AuthResponse>()
    await this.storeTokenAndUsername(authResponse.token, authResponse.userId, values.email, 'internal')
    return authResponse
  }

  async loginSocial(values: any): Promise<AuthResponse> {
    const authResponse = await this.http.post<AuthResponse>(AppConfig.apiUrl + `login-social`, values,
                     {responseType : 'json', observe: 'body', headers: this.headers}).toPromise<AuthResponse>()
    await this.storeTokenAndUsername(authResponse.token, authResponse.userId, values.email, 'social')
    return authResponse
  }

  async logout() {
    await this.storage.remove('jwt');
    await this.storage.remove('userId');
    await this.storage.remove('email');
    await this.storage.remove('loginType')
    await this.storage.remove('offline')
    this.isOffline = false
  }

  async signup(values: any): Promise<AuthResponse> {
    const authResponse = await this.http.post<AuthResponse>(AppConfig.apiUrl + `register`, values,
                {responseType : 'json', observe: 'body', headers: this.headers}).toPromise<AuthResponse>()
    if (authResponse.token != null) {
       await this.storeTokenAndUsername(authResponse.token, authResponse.userId, values.email, 'internal');
    } 
    return authResponse
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


