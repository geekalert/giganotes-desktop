import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-folder-dialog',
  templateUrl: './add-folder-dialog.component.html',
  styleUrls: ['./add-folder-dialog.component.scss']
})
export class AddFolderDialogComponent implements OnInit {

  folderName = '';

  constructor(
    public dialogRef: MatDialogRef<AddFolderDialogComponent>) {
  }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }
}