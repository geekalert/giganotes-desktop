import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ResizableDirective } from './directives/resizable.directive';

import { EditorModule } from '@tinymce/tinymce-angular';

import { NotesListWithEditorComponent } from './home/notes-list-with-editor/notes-list-with-editor.component';
import { AppRoutingModule } from './/app-routing.module';
import { NavigationTreeComponent } from './home/navigation-tree/navigation-tree.component';
import { SettingsComponent } from './home/settings/settings.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

import { HomeRoutingModule } from './home/home-routing.module';

import { APP_INITIALIZER } from '@angular/core';

import { DbService } from './services/db-service';
import { LoggerService } from './services/logger-service';
import { ElectronService } from './providers/electron.service';

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
  MatTreeModule
} from '@angular/material';

@NgModule({
   declarations: [
      AppComponent,
      ResizableDirective,
      NotesListWithEditorComponent,
      NavigationTreeComponent,
      SettingsComponent,
      LoginComponent,
      HomeComponent
   ],
   imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
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
      FlexLayoutModule,
      EditorModule,
      HomeRoutingModule,
      AppRoutingModule
   ],
   providers: [DbService, LoggerService, ElectronService,
    {
      provide: APP_INITIALIZER,
      useFactory: (dbService: DbService) => function() {return dbService.openDatabase()},
      deps: [DbService],
      multi: true
    }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
