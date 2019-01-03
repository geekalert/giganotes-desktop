import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationTreeComponent } from '../home/navigation-tree/navigation-tree.component';
import { NotesListWithEditorComponent } from './notes-list-with-editor/notes-list-with-editor.component';
import { AddFolderDialogComponent } from '../home/add-folder-dialog/add-folder-dialog.component';
import { RenameFolderDialogComponent } from '../home/rename-folder-dialog/rename-folder-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { SelectFolderDialogComponent } from '../home/select-folder-dialog/select-folder-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { ResizableDirective } from '../directives/resizable.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DragAndDropModule } from 'angular-draggable-droppable';

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
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


const homeRoutes: Routes = [
      {
        path: '',
        component: NotesListWithEditorComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes),
    FormsModule,
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
    EditorModule,
    LayoutModule,
    CommonModule,
    DragAndDropModule
  ],
  exports: [
    RouterModule,
    NotesListWithEditorComponent,
    NavigationTreeComponent,
    AddFolderDialogComponent,
    RenameFolderDialogComponent,
    SelectFolderDialogComponent,
    ConfirmDialogComponent
    SettingsComponent
  ],
  entryComponents:
    [
      AddFolderDialogComponent,
      RenameFolderDialogComponent,
      SelectFolderDialogComponent,
      ConfirmDialogComponent
    ],
  declarations: [
    ResizableDirective,
    NotesListWithEditorComponent,
    NavigationTreeComponent,
    AddFolderDialogComponent,
    RenameFolderDialogComponent,
    SelectFolderDialogComponent,
    ConfirmDialogComponent,
    SettingsComponent
  ]
})
export class HomeRoutingModule { }
