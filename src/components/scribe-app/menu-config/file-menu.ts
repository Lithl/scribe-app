/**
 * @fileoverview Exports the "File" menu and its submenus/menu items
 */
import {MenuDescription} from '../../menu-bar/menu-item';

export const fileMenu_new_project = {
  name: 'Project',
  icon: 'extension',
  actions: ['new-project'],
} as MenuDescription;

export const fileMenu_new_manuscript = {
  name: 'Manuscript',
  icon: 'chrome-reader-mode',
  actions: ['new-manuscript'],
} as MenuDescription;

export const fileMenu_new_idea = {
  name: 'Idea',
  icon: 'lightbulb-outline',
  actions: ['new-idea'],
} as MenuDescription;

export const fileMenu_new_chapter = {
  name: 'Chapter',
  icon: 'book',
  actions: ['new-chapter'],
} as MenuDescription;

export const fileMenu_new_scene = {
  name: 'Scene',
  icon: 'device:wallpaper',
  actions: ['new-scene'],
} as MenuDescription;

export const fileMenu_new_character = {
  name: 'Character',
  icon: 'face',
  actions: ['new-character'],
} as MenuDescription;

export const fileMenu_new_location = {
  name: 'Location',
  icon: 'maps:satellite',
  actions: ['new-location'],
} as MenuDescription;

export const fileMenu_new_note = {
  name: 'Note',
  icon: 'av:note',
  actions: ['new-note'],
} as MenuDescription;

export const fileMenu_new_research = {
  name: 'Research',
  icon: 'work',
  actions: ['new-research'],
} as MenuDescription;

export const fileMenu_new_template = {
  name: 'Template',
  icon: 'device:widgets',
  actions: ['new-template'],
} as MenuDescription;

export const fileMenu_new = {
  name: 'New...',
  items: [
    fileMenu_new_project,
    {separator: true},
    fileMenu_new_manuscript,
    fileMenu_new_idea,
    fileMenu_new_chapter,
    fileMenu_new_scene,
    fileMenu_new_character,
    fileMenu_new_location,
    fileMenu_new_note,
    fileMenu_new_research,
    fileMenu_new_template,
  ],
} as MenuDescription;

export const fileMenu_save = {
  name: 'Save',
  shortcut: 'Ctrl+S',
  icon: 'save',
  actions: ['force-save'],
} as MenuDescription;

export const fileMenu_exportTo_googleDrive = {
  name: 'Google Drive',
  icon: 'cloud-upload',
  actions: ['drive-export'],
} as MenuDescription;

export const fileMenu_exportTo_localDownload = {
  name: 'Local download',
  icon: 'file-download',
  actions: ['download-project'],
} as MenuDescription;

export const fileMenu_exportTo_fimfiction = {
  name: 'Fimfiction',
  icon: 'fim:favicon',
  actions: ['fim-export'],
} as MenuDescription;

export const  fileMenu_exportTo = {
  name: 'Export to...',
  items: [
    fileMenu_exportTo_googleDrive,
    fileMenu_exportTo_localDownload,
    fileMenu_exportTo_fimfiction,
  ],
} as MenuDescription;

export const fileMenu_open = {
  name: 'Open',
  shortcut: 'Ctrl+O',
  icon: 'folder',
  actions: ['open-project'],
} as MenuDescription;

export const fileMenu_openRecent = {
  name: 'Open recent...',
  items: [],
} as MenuDescription;

export const fileMenu = {
  name: 'File',
  items: [
    fileMenu_new,
    {separator: true},
    fileMenu_save,
    fileMenu_exportTo,
    fileMenu_open,
    fileMenu_openRecent,
  ],
} as MenuDescription;
