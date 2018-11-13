import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { TreeItem, TreeFolderItem } from '../model/ui/tree-item';
import { AuthService } from '../services/auth-service';
import { SocialAuthService } from '../services/social-auth/social-auth-service';
import { LocalNoteService } from '../services/local-note-service';
import { SyncService } from '../services/sync-service';
import { EventBusService } from '../services/event-bus-service';
import { NavigationTreeComponent } from './navigation-tree/navigation-tree.component';
import { NavigateEvent } from '../model/events/navigate-event';
import { SyncFinishedEvent } from '../model/events/sync-finished';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'mattest';
  isDarkTheme = true;
  bannerPath = 'assets/icon58x64.png';
  items = Array<TreeItem>();
  allNotesMenuItem = new TreeItem();
  rootItem = new TreeFolderItem();
  myNotesMenuItem: TreeFolderItem;
  treeItemsMap = new Map<string, TreeItem>();

  @ViewChild(NavigationTreeComponent) navigationTree: NavigationTreeComponent;

  constructor(private zone:NgZone,
    private route: ActivatedRoute,
    private authService: AuthService,
    private syncService: SyncService,
    private socialAuthService: SocialAuthService,
    private noteService: LocalNoteService,
    private eventBusService: EventBusService,
    private router: Router, ) {

  }

  ngOnInit() {
    this.eventBusService.getMessages().subscribe(e => {
      if (e instanceof NavigateEvent) {
        this.onHandleNoteNavigation(e.noteId)
      }

      if (e instanceof SyncFinishedEvent) {
        this.myNotesMenuItem.subItems = []
        this.loadChildrenToFolder(this.myNotesMenuItem)
        this.navigationTree.onSelectedItemClick(this.allNotesMenuItem)
      }
    })

    this.init();
  }

  async doSync() {
    if (this.authService.isOffline) {
      return;
    }
    await this.syncService.doSync();
    this.eventBusService.sendMessage(new SyncFinishedEvent())
  }

  async onHandleNoteNavigation(noteId : string) {
    const note = await this.noteService.loadNoteById(noteId)
    await this.navigationTree.clearAnySelection(this.rootItem)
    const folderItem = this.treeItemsMap.get(note.folderId)
    this.makeSelectedWithExpandingParents(folderItem)
    this.zone.run(() => {
      this.router.navigate(['list', { mode: 'folder', folderId: note.folderId, noteId: noteId }], { relativeTo: this.route })
    })
  }

  makeSelectedWithExpandingParents(curItem: TreeItem) {
    let item = curItem;
    item.isSelected = true
    while (item.parent != null) {
      item = item.parent
      if (!item.expanded) {
        item.expanded = true
      }
    }
  }

  async init() {
    await this.loadItems();
    await this.doSync();
  }

  async logout() {
    await this.authService.logout();

    if (this.authService.loginType === 'social') {
      await this.socialAuthService.signOut();
    }

    this.router.navigate(['login'])
  }

  onAllNotesClick(parent, item) {
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
    const foldersList = await this.noteService.getAllFolders(false)
    const sortedFoldersList = foldersList.sort((a, b) => a.level - b.level);

    this.treeItemsMap.set(sortedFoldersList[0].id, root)

    for (let i = 1; i < sortedFoldersList.length; i++) {
      const curFolder = sortedFoldersList[i]
      const parentItem = curFolder.parentId == null ? root : this.treeItemsMap.get(curFolder.parentId)

      const curTreeItem = new TreeFolderItem();

      curTreeItem.folderId = curFolder.id;
      curTreeItem.showMenuButton = true;
      curTreeItem.hasAddButton = true;
      curTreeItem.iconName = 'folder'
      curTreeItem.onClick = (item: any) => {
        this.onFolderClick(this, item)
      };
      curTreeItem.name = curFolder.title;
      curTreeItem.parent = parentItem;

      parentItem.subItems.push(curTreeItem)
      this.treeItemsMap.set(curFolder.id, curTreeItem)
    }

    return Promise.resolve(root)
  }

  async loadItems() {

    // Pseudo root item

    this.allNotesMenuItem.onClick = (item: any) => {
      this.onAllNotesClick(this, item)
    };
    this.allNotesMenuItem.name = "All notes";
    this.allNotesMenuItem.iconName = 'list'
    this.allNotesMenuItem.parent = this.rootItem;
    this.allNotesMenuItem.isSelected = true; //Select 'All notes' item by default (while last folder persistense is not implemented)

    this.items.push(this.allNotesMenuItem)

    const favoritesMenuItem = new TreeItem();
    favoritesMenuItem.onClick = (item: any) => {
      this.onFavoritesClick(this, item)
    };
    favoritesMenuItem.name = "Favorites";
    favoritesMenuItem.iconName = 'favorite'
    favoritesMenuItem.parent = this.rootItem;

    this.items.push(favoritesMenuItem)

    const rootFolder = await this.noteService.getRootFolder();

    this.myNotesMenuItem = new TreeFolderItem();
    this.myNotesMenuItem.folderId = rootFolder.id;
    this.myNotesMenuItem.showMenuButton = true;
    this.myNotesMenuItem.hasAddButton = true;
    this.myNotesMenuItem.onClick = (item: any) => {
      this.onFolderClick(this, item);
    }
    this.myNotesMenuItem.name = "Root folder";
    this.myNotesMenuItem.iconName = 'folder'
    this.myNotesMenuItem.parent = this.rootItem;
    this.myNotesMenuItem.expanded = true

    this.items.push(this.myNotesMenuItem)

    this.rootItem.subItems.push(...this.items)
    await this.loadChildrenToFolder(this.myNotesMenuItem)
  }

}
