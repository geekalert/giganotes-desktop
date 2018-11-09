import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from "@angular/router";
import { LocalNoteService } from '../../services/local-note-service';
import { Note } from '../../model/note';
import { Folder } from '../../model/folder';
import { LinkTreeItem } from '../../model/ui/linktreeitem';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../../services/auth-service';
import { SyncService } from '../../services/sync-service';
import { EventBusService } from '../../services/event-bus-service';
import { NavigateEvent } from '../../model/events/navigate-event';
import { Observable, Subject } from 'rxjs'

@Component({
  selector: 'app-notes-list-with-editor',
  templateUrl: './notes-list-with-editor.component.html',
  styleUrls: ['./notes-list-with-editor.component.css'],
  host: { "style": "height:100%; display: flex; flex-direction:column" }
})
export class NotesListWithEditorComponent implements OnInit {

  INTERNAL_LINK_PREFIX = 'local:';

  public searchFilter: string;
  notes = Array<Note>();
  selectedNote = new Note();
  currentFolder: Folder;
  noteEditor: any;
  editorSetup: any;

  //Parameters
  mode: string;
  folderId: string;
  noteId: string;

  private localEvents = new Subject<any>();

  ngOnInit() {

    this.route.params.subscribe(params => {
      switch (params.mode) {
        case 'all':
          this.mode = 'all'
          break
        case 'fav':
          this.mode = 'fav'
          break
        case 'folder':
          this.mode = 'folder'
          this.folderId = params.folderId
          this.noteId = params.noteId
          break
        default:
          this.mode = 'all'
      }
      this.loadData();
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
        { text: 'HTML/XML', value: 'markup' },
        { text: 'JavaScript', value: 'javascript' },
        { text: 'bash', value: 'bash' },
        { text: 'JSON', value: 'json' },
        { text: "go", value: "go" },
        { text: 'CSS', value: 'css' },
        { text: 'PHP', value: 'php' },
        { text: 'Ruby', value: 'ruby' },
        { text: 'Python', value: 'python' },
        { text: 'Java', value: 'java' },
        { text: 'C', value: 'c' },
        { text: 'C#', value: 'csharp' },
        { text: 'C++', value: 'cpp' }
      ],
      paste_data_images: true, setup: editor => {
        this.noteEditor = editor;
        this.localEvents.next({type: 'editorReady'})
      }
    };

    this.onDoSync();
  }

  constructor(iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private localNoteService: LocalNoteService,
    private authService: AuthService,
    private syncService: SyncService,
    private eventBusService: EventBusService
  ) {
    // To avoid XSS attacks, the URL needs to be trusted from inside of your application.
    const avatarsSafeUrl = sanitizer.bypassSecurityTrustResourceUrl('./assets/avatars.svg');

    iconRegistry.addSvgIconSetInNamespace('avatars', avatarsSafeUrl);
  }

  loadData() {
    switch (this.mode) {
      case 'all':
        this.loadAllNotes()
        break;
      case 'fav':
        this.loadFavorites();
        break;
      case 'folder':
        this.loadNotes(this.folderId)
        break;
    }
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

  async buildTreeFromNodesList(): Promise<Folder> {
    const folders = await this.localNoteService.getAllFolders(false)
    const notes = await this.localNoteService.getAllNotes(false)

    folders.sort((a, b) => a.level - b.level)
    notes.sort((a, b) => a.level - b.level)

    const root = folders[0]
    const foldersMap = new Map<string, Folder>();
    foldersMap.set(root.id, root)

    for (let i = 1; i < folders.length; i++) {
      const folder = folders[i];
      const parentFolder = foldersMap.get(folder.parentId)

      if (parentFolder.children == null) {
        parentFolder.children = Array<Folder>();
      }
      parentFolder.children.push(folder)
      foldersMap.set(folder.id, folder)
    }

    for (const note of notes) {
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
    this.currentFolder = await this.localNoteService.getRootFolder()
    this.selectFirstNote()
  }

  async loadFavorites() {
    this.notes = await this.localNoteService.getFavoriteNotes()
    this.selectFirstNote()
  }

  async loadNotes(folderId: string) {
    this.selectedNote.text = ''
    this.selectedNote.title = ''

    this.notes = await this.localNoteService.loadNotesByFolder(folderId)
    this.currentFolder = await this.localNoteService.loadFolderById(folderId)
    
    if (this.noteId != null) {
      const filteredBySelectedId = this.notes.filter(n => n.id == this.noteId)
      if (filteredBySelectedId.length == 1) {
        const noteToSelect = filteredBySelectedId[0]        
        this.selectedNote = noteToSelect        
      }
    } else {
      this.selectFirstNote() 
    }
  }

  selectFirstNote() {
    if (this.notes.length > 0) {      
      this.selectedNote = this.notes[0];      
    }
  }


  onNoteClick(note: Note) {
    this.selectedNote = note    
  }


  async onNewNote() {
    this.selectedNote = await this.createNote()    
    this.notes.push(this.selectedNote)
  }

  async createNote(): Promise<Note> {
    let note = new Note()
    note.title = ''
    note.text = ''
    note.id = uuid()
    note.folderId = this.currentFolder.id
    note.level = this.currentFolder.level + 1
    note.userId = this.authService.userId
    let now = new Date()
    note.createdAt = now
    note.updatedAt = now
    await this.localNoteService.uploadNote(note)
    return Promise.resolve(note)
  }

  onSaveNote() {
    if (this.selectedNote == null) {
      return
    }

    this.selectedNote.text = this.noteEditor.getContent();

    this.selectedNote.updatedAt = new Date();
    this.localNoteService.updateNote(this.selectedNote);
  }

  async onDoSync() {
    // Make sync
    await this.syncService.doSync();

    await this.loadData();
  }

  isSyncing() {
    return this.syncService.isSyncing();
  }

  searchNotesKeyUp(event) {
    this.searchNotes()
  }

  async searchNotes() {
    if (this.mode == 'all') {
      this.notes = await this.localNoteService.searchNotes(this.searchFilter, null)
    } else if (this.mode == 'folder') {
      this.notes = await this.localNoteService.searchNotes(this.searchFilter, this.currentFolder.id)
    }
  }

  async handleEditorClick(event: any) {
    const element = event.event.srcElement;
    if (element.tagName === 'A') {
      const hrefValue = element.attributes['href'].value;
      if (hrefValue.indexOf(this.INTERNAL_LINK_PREFIX) !== -1) {
        const id = hrefValue.substring(6);
        const event = new NavigateEvent(id)
        this.eventBusService.sendMessage(event)
      }
    }
  }

  async onAddToFavorites() {
    this.localNoteService.addToFavorites(this.selectedNote.id)
  }
}
