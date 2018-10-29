import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from "@angular/router";
import { LocalNoteService } from '../../services/local-note-service';
import { Note } from '../../model/note';

@Component({
  selector: 'app-notes-list-with-editor',
  templateUrl: './notes-list-with-editor.component.html',
  styleUrls: ['./notes-list-with-editor.component.css'],
  host: { "style": "height:100%; display: flex; flex-direction:column" }
})
export class NotesListWithEditorComponent implements OnInit {

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

    this.editorSetup = {
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
