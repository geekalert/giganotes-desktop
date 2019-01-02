import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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


const homeRoutes: Routes = [
      {
        path: '',
        component: ForgotPasswordComponent
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
    LayoutModule,
    CommonModule
  ],
  exports: [
    ForgotPasswordComponent
  ],
  declarations: [
    ForgotPasswordComponent
  ]
})
export class ForgotPasswordRoutingModule { }
