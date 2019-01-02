import { ScreenService } from './services/screen.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';

import { APP_INITIALIZER } from '@angular/core';

import { DbService } from './services/db-service';
import { LoggerService } from './services/logger-service';
import { ElectronService } from './providers/electron.service';
import { LocalNoteService } from './services/local-note-service';
import { RemoteNoteService } from './services/remote-note-service';
import { SyncService } from './services/sync-service';

import { AuthGuard } from './guards/auth-guard';
import { AuthService } from './services/auth-service';
import { AuthServiceConfig, SocialAuthService } from './services/social-auth/social-auth-service';
import { GoogleLoginProvider } from './services/social-auth/google-login-provider';
import { HttpClient } from '@angular/common/http';
import { Storage } from './services/storage';

import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import { AppConfig } from '../environments/environment';

export function provideSocialConfig(http: HttpClient) {
  return new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(http, "991995282025-4159nc4q0l83fkapl4j3qav55asa38g6.apps.googleusercontent.com")
    },
  ]);
}

export function jwtOptionsFactory(storage: Storage) {
  return {
    tokenGetter: () => {
      return storage.get('jwt');
    },
    whitelistedDomains: [AppConfig.apiUrl]
  }
}

import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatToolbarModule,
  MatTreeModule,
  MatProgressBarModule
} from '@angular/material';
import { EventBusService } from './services/event-bus-service';
import { DataService } from './services/data-service';
import { DynamicScriptLoaderService } from './services/dynamic-script-loader.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage]
      }
    }),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    MatTreeModule,
    MatProgressBarModule,
    FlexLayoutModule,
    AppRoutingModule,
    LayoutModule
  ],
  providers: [DbService,
    LoggerService,
    LocalNoteService,
    RemoteNoteService,
    SyncService,
    ElectronService,
    AuthGuard,
    AuthService,
    EventBusService,
    DataService,
    Storage,
    SocialAuthService,
    ScreenService,
    DynamicScriptLoaderService,
    {
      provide: APP_INITIALIZER,
      useFactory: (dbService: DbService) => function () { return dbService.openDatabase() },
      deps: [DbService],
      multi: true
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideSocialConfig,
      deps: [HttpClient]
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
