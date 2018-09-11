import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { TreeItem } from '../../model/ui/tree-item';

@Component({
  selector: 'app-navigation-tree',
  templateUrl: './navigation-tree.component.html',
  styleUrls: ['./navigation-tree.component.css']
})
export class NavigationTreeComponent implements OnInit {

  @Input() public items: Array<TreeItem>;
  @Input() public level = 0;

  selectedItem: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSelectedItemClick(item) {
    this.selectedItem = item
    item.onClick(this, item)
  }

  onItemClick2() {
  }

}
