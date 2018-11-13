import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { TreeItem, TreeFolderItem } from '../../model/ui/tree-item';
import { AddFolderDialogComponent } from '../add-folder-dialog/add-folder-dialog.component';
import { RenameFolderDialogComponent } from '../rename-folder-dialog/rename-folder-dialog.component'
import { Folder } from '../../model/folder';
import { v4 as uuid } from 'uuid';
import { LocalNoteService } from '../../services/local-note-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navigation-tree',
  templateUrl: './navigation-tree.component.html',
  styleUrls: ['./navigation-tree.component.css']
})
export class NavigationTreeComponent implements OnInit {

  @Input() public items: Array<TreeItem>;
  @Input() public level = 0;

  constructor(private router: Router,
     private dialog: MatDialog,
     private noteService: LocalNoteService,
     private authService: AuthService) { }

  ngOnInit() {
  }

  onSelectedItemClick(item: TreeItem) {
    this.clearAnySelection(item)
    item.isSelected = true
    item.onClick(item)
  }

  clearAnySelection(curItem: TreeItem) {
    let item = curItem;
    while (item.parent != null) {
      item = item.parent
    }
    item.clearSelectionRecursive()
  }

  onItemClick2() {
  }

  onAddFolder(item: TreeFolderItem) {
    const dialogRef = this.dialog.open(AddFolderDialogComponent, {
      width: '250px'
    });

    const parent = this;
    dialogRef.afterClosed().subscribe(folderName => {
      if (folderName.length > 0) {
        parent.createFolder(item, folderName)
      }
    });
  }

  async createFolder(parentTreeItem: TreeFolderItem, folderName: string) {
    const parent = await this.noteService.loadFolderById(parentTreeItem.folderId)
    const folder = new Folder();
    let now = new Date()
    folder.createdAt = now
    folder.updatedAt = now
    folder.id = uuid()
    folder.title= folderName
    folder.parentId = parent.id
    folder.level = parent.level + 1
    folder.userId = this.authService.userId
    await this.noteService.uploadFolder(folder)

    const treeItem = new TreeFolderItem();

    this.clearAnySelection(parentTreeItem)
    parentTreeItem.expanded = true

    treeItem.folderId = folder.id;
    treeItem.isSelected =false
    treeItem.showMenuButton = true;
    treeItem.hasAddButton = true;
    treeItem.iconName = 'folder'
    treeItem.onClick = parentTreeItem.onClick;
    treeItem.name = folder.title;
    treeItem.parent = parentTreeItem;
    treeItem.isSelected = true

    parentTreeItem.subItems.push(treeItem)

    treeItem.onClick(treeItem)

  }

  onRenameFolder(item: TreeFolderItem) {
    const dialogRef = this.dialog.open(RenameFolderDialogComponent, {
      width: '250px'
    });

    const parent = this;
    dialogRef.afterClosed().subscribe(folderName => {
      if (folderName.length > 0) {
        parent.renameFolder(item, folderName)
      }
    });
  }

  async renameFolder(treeItem: TreeFolderItem, folderName: string) {
    const folder = await this.noteService.loadFolderById(treeItem.folderId)
    folder.title = folderName
    await this.noteService.updateFolder(folder)
    treeItem.name = folderName
  }

  onDeleteFolder(item: TreeFolderItem) {
    this.noteService.removeFolder(item.folderId)
    const ix = item.parent.subItems.indexOf(item)
    item.parent.subItems.splice(ix, 1)
    item.parent.isSelected = true
  }

}
