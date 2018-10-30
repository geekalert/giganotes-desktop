import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from "@angular/router";
import { LocalNoteService } from '../../services/local-note-service';
import { Note } from '../../model/note';
import { Folder } from '../../model/folder';
import { LinkTreeItem } from '../../model/ui/linktreeitem';

@Component({
  selector: 'app-notes-list-with-editor',
  templateUrl: './notes-list-with-editor.component.html',
  styleUrls: ['./notes-list-with-editor.component.css'],
  host: { "style": "height:100%; display: flex; flex-direction:column" }
})
export class NotesListWithEditorComponent implements OnInit {

  INTERNAL_LINK_PREFIX = 'local:';

  public searchFor: string;
  notes = Array<Note>();
  selectedNote = new Note();
  noteEditor: any;
  editorSetup: any;

  ngOnInit() {
    this.route.params.subscribe(params => {
      switch (params.mode) {
        case 'all':
          this.loadAllNotes()
        case 'fav':
          //this.users = this.favUsers;
          break;
        case 'folder':
          this.loadNotes(params.folderId)
          break;
      }
    })

    const parent = this;
    this.editorSetup = {
      plugins: 'paste link anchor toc searchreplace table code codesample lists print textcolor',
      menubar: false,
      statusbar: false,
      branding: false,
      toolbar: 'print | insert | undo redo | formatselect | bold italic underline backcolor forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | code codesample',
      link_list: async function (success) {
        const list = await parent.prepareLinkSelectionMenu()
        success(list)
      },
      codesample_languages: [
        {text: 'HTML/XML', value: 'markup'},
        {text: 'JavaScript', value: 'javascript'},
        {text: 'bash',value: 'bash'},  
        {text: 'JSON',value: 'json'},
        {text:"go",value:"go"},         
        {text: 'CSS', value: 'css'},
        {text: 'PHP', value: 'php'},
        {text: 'Ruby', value: 'ruby'},
        {text: 'Python', value: 'python'},
        {text: 'Java', value: 'java'},
        {text: 'C', value: 'c'},
        {text: 'C#', value: 'csharp'},
        {text: 'C++', value: 'cpp'}
      ],      
      paste_data_images: true, setup: editor => {
        this.noteEditor = editor;
      }
    };

  }

  constructor(iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private localNoteService: LocalNoteService
  ) {
    // To avoid XSS attacks, the URL needs to be trusted from inside of your application.
    const avatarsSafeUrl = sanitizer.bypassSecurityTrustResourceUrl('./assets/avatars.svg');

    iconRegistry.addSvgIconSetInNamespace('avatars', avatarsSafeUrl);
  }

  async readFolderToLinkSelectionMenu(folder: Folder, items: LinkTreeItem[]) {
    if (folder.notes != null) {
        for (const note of folder.notes) {
          const link = new LinkTreeItem(note.title)
          link.value = this.INTERNAL_LINK_PREFIX + note.id;
          items.push(link);
        }
    }

    if (folder.children != null) {
        for (const childFolder of folder.children) {
          const link = new LinkTreeItem(childFolder.title);
          link.menu = new Array<LinkTreeItem>();
          await this.readFolderToLinkSelectionMenu(childFolder, link.menu);
          items.push(link);
        }
    }

  }

  async prepareLinkSelectionMenu(): Promise<LinkTreeItem[]> {
    let items = new Array<LinkTreeItem>();
    const rootFolder = await this.buildTreeFromNodesList();
    await this.readFolderToLinkSelectionMenu(rootFolder, items)
    return items
  }  

  async buildTreeFromNodesList() : Promise<Folder> {
    const folders = await this.localNoteService.getAllFolders(false)
    const notes = await this.localNoteService.getAllNotes(false)

    folders.sort((a, b) => a.level - b.level)
    notes.sort((a, b) => a.level - b.level)
  
    const root = folders[0]
    const foldersMap = new Map<string, Folder>();
    foldersMap.set(root.id, root)

    for(let i = 1; i < folders.length; i++) {
      const folder = folders[i];
      const parentFolder = foldersMap.get(folder.parentId)
      
      if (parentFolder.children == null) {
          parentFolder.children = Array<Folder>();
      }
      parentFolder.children.push(folder)
      foldersMap.set(folder.id, folder)
    }

    for(const note of notes) {
      const parentFolder = foldersMap.get(note.folderId)

      if (parentFolder.notes == null) {
        parentFolder.notes = Array<Note>();
      }                 
      parentFolder.notes.push(note)      
    }
  
    return Promise.resolve(root)
  }

  async loadAllNotes() {
    this.notes = await this.localNoteService.getAllNotes(false)
  }
  
  async loadNotes(folderId: string) {
    this.notes = await this.localNoteService.loadNotesByFolder(folderId)
  }
  openNote(note: Note) {
    this.noteEditor.setContent(note.text);
    this.noteEditor.focus();
  }

  onNoteClick(note: Note) {
    this.selectedNote = note
    this.openNote(note)
  }

  onNewNote() {

  }
  
  onSaveNote() {    
  }

  searchRepositoryKeyDown(event) {

  }

  searchRepository() {

  }
}
