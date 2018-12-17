import {MenuDescription} from '../../menu-bar/menu-item';

export const editMenu_undo = {
  name: 'Undo',
  shortcut: 'Ctrl+Z',
  icon: 'undo',
  actions: ['undo-action'],
} as MenuDescription;

export const editMenu_redo = {
  name: 'Redo',
  shortcut: 'Ctrl+Shift+Z',
  icon: 'redo',
  actions: ['redo-action'],
} as MenuDescription;

export const editMenu_cut = {
  name: 'Cut',
  shortcut: 'Ctrl+X',
  icon: 'content-cut',
  actions: ['cut-text'],
} as MenuDescription;

export const editMenu_copy = {
  name: 'Copy',
  shortcut: 'Ctrl+C',
  icon: 'content-copy',
  actions: ['copy-text'],
} as MenuDescription;

export const editMenu_paste = {
  name: 'Paste',
  shortcut: 'Ctrl+V',
  icon: 'content-paste',
  actions: ['paste-text'],
} as MenuDescription;

export const editMenu_delete = {
  name: 'Delete',
  shortcut: 'Delete',
  icon: 'delete',
  actions: ['delete-text'],
} as MenuDescription;

export const editMenu_selectAll = {
  name: 'Select all',
  shortcut: 'Ctrl+A',
  icon: 'select-all',
  actions: ['select-text'],
} as MenuDescription;

export const editMenu_findReplace = {
  name: 'Find and replace',
  shortcut: 'Ctrl+F',
  icon: 'find-replace',
  actions: ['find-replace'],
} as MenuDescription;

export const editMenu = {
  name: 'Edit',
  items: [
    editMenu_undo,
    editMenu_redo,
    {separator: true},
    editMenu_cut,
    editMenu_copy,
    editMenu_paste,
    editMenu_delete,
    editMenu_selectAll,
    {separator: true},
    editMenu_findReplace,
  ],
} as MenuDescription;
