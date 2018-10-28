import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSelectedItemClick(item: TreeItem) {    
    this.clearAnySelection(item)
    item.isSelected = true
    item.onClick(item)    
  }

  clearAnySelection(curItem: TreeItem) {
      let item = curItem;
      while(item.parent != null) {
          item = item.parent
      }
      item.clearSelectionRecursive()
  }

  onItemClick2() {
  }

}
