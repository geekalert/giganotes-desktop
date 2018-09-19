import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { NotesListWithEditorComponent } from './notes-list-with-editor/notes-list-with-editor.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from '../guards/auth-guard';
import { from } from 'rxjs'

const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: NotesListWithEditorComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule { }