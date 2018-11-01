import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { TreeItem } from '../../model/ui/tree-item';
import { AddFolderDialogComponent } from '../add-folder-dialog/add-folder-dialog.component';

@Component({
  selector: 'app-navigation-tree',
  templateUrl: './navigation-tree.component.html',
  styleUrls: ['./navigation-tree.component.css']
})
export class NavigationTreeComponent implements OnInit {

  @Input() public items: Array<TreeItem>;
  @Input() public level = 0;

  constructor(private router: Router, private dialog: MatDialog) { }

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

  onAddFolder() {
    const dialogRef = this.dialog.open(AddFolderDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onRenameFolder(item: TreeItem) {

  }

  onDeleteFolder(item: TreeItem) {

  }

}
