export class TreeItem {
    public name: string;
    public showMenuButton = false;
    public hasAddButton = false;
    public iconName: string;
    public subItems = Array<TreeItem>();

    public onClick: (parent: any, item: any) => void;
}

export class TreeFolderItem extends TreeItem {
    public folderId: string;
}