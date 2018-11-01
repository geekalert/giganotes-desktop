import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-rename-folder-dialog',
  templateUrl: './rename-folder-dialog.component.html',
  styleUrls: ['./rename-folder-dialog.component.scss']
})
export class RenameFolderDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RenameFolderDialogComponent>) {
  }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }
}
