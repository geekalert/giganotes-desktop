import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { TreeItem, TreeFolderItem } from '../model/ui/tree-item';
import { AuthService } from '../services/auth-service';
import { SocialAuthService } from '../services/social-auth/social-auth-service';

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
    private router: Router, ) {

  }

  ngOnInit() {
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
    parent.router.navigate(['list', { mode: 'all' }], { relativeTo: this.route })
  }

  onFavoritesClick(parent, item) {
    parent.router.navigate(['list', { mode: 'fav' }], { relativeTo: this.route })
  }

  onFolderClick(parent, item) {
    parent.router.navigate(['list', { mode: 'folder', folderId: item.folderId }], { relativeTo: this.route })
  }


  onItemClick2() {

  }

  loadChildrenToFolder(parentFolderItem: TreeItem) {
    const myNotesMenuSubItem = new TreeFolderItem();
    myNotesMenuSubItem.folderId = '112';
    myNotesMenuSubItem.showMenuButton = true;
    myNotesMenuSubItem.hasAddButton = true;
    myNotesMenuSubItem.onClick = this.onFolderClick;
    myNotesMenuSubItem.name = "SubChild";
    myNotesMenuSubItem.iconName = parentFolderItem.iconName
    parentFolderItem.subItems.push(myNotesMenuSubItem)
  }

  loadItems() {

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

    this.loadChildrenToFolder(myNotesMenuItem)
  }

}
