import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { TreeItem, TreeFolderItem } from '../model/ui/tree-item';
import { AuthService } from '../services/auth-service';
import { SocialAuthService } from '../services/social-auth/social-auth-service';
import { LocalNoteService } from '../services/local-note-service';
import { RemoteNoteService } from '../services/remote-note-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'mattest';
  isDarkTheme = true;
  items = Array<TreeItem>();

  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private localNoteService: LocalNoteService,
    private remoteNoteService: RemoteNoteService,
    private router: Router, ) {

  }

  ngOnInit() {
    this.localNoteService.getAllFolders(false).then((folders) => {
      console.log(folders.length)
    })

    this.loadItems();
  }

  async logout() {
    await this.authService.logout();

    if (this.authService.loginType === 'social') {
      await this.socialAuthService.signOut();
    }

    this.router.navigate(['login'])
  }

  onItemClick(parent, item) {
    parent.router.navigate(['list', { mode: 'all' }], { relativeTo: parent.route })
  }

  onFavoritesClick(parent, item) {
    parent.router.navigate(['list', { mode: 'fav' }], { relativeTo: parent.route })
  }

  onFolderClick(parent, item) {
    parent.router.navigate(['list', { mode: 'folder', folderId: item.folderId }], { relativeTo: parent.route })
  }


  onItemClick2() {

  }

  async loadChildrenToFolder(root: TreeFolderItem) {
    const foldersList = await this.localNoteService.getAllFolders(false)
    const sortedFoldersList = foldersList.sort((a, b) => a.level - b.level);

    const treeItemsMap = new Map<string, TreeItem>();
    treeItemsMap.set(sortedFoldersList[0].id, root)

    for (let i = 1; i < sortedFoldersList.length; i++) {
      const curFolder = sortedFoldersList[i]
      const parentItem = curFolder.parentId == null ? root : treeItemsMap.get(curFolder.parentId)

      const curTreeItem = new TreeFolderItem();

      curTreeItem.folderId = curFolder.id;
      curTreeItem.showMenuButton = true;
      curTreeItem.hasAddButton = true;
      curTreeItem.onClick = (item: any) => {
        this.onFolderClick(this, item)
      };
      curTreeItem.name = curFolder.title;

      parentItem.subItems.push(curTreeItem)
      treeItemsMap.set(curFolder.id, curTreeItem)
    }

    return Promise.resolve(root)
  }

  async loadItems() {

    const allNotesMenuItem = new TreeItem();
    allNotesMenuItem.onClick = this.onItemClick;
    allNotesMenuItem.name = "All notes";
    allNotesMenuItem.iconName = 'list'
    this.items.push(allNotesMenuItem)

    const myNotesMenuItem = new TreeFolderItem();
    myNotesMenuItem.folderId = '111';
    myNotesMenuItem.showMenuButton = true;
    myNotesMenuItem.hasAddButton = true;
    myNotesMenuItem.onClick = this.onFolderClick;
    myNotesMenuItem.name = "My notes";
    myNotesMenuItem.iconName = 'folder'
    this.items.push(myNotesMenuItem)

    await this.loadChildrenToFolder(myNotesMenuItem)
  }

}
