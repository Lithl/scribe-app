/**
 * @fileoverview Exports the "Insert" menu and its submenus/menu items
 */
import {MenuDescription} from '../../menu-bar/menu-item';

export const insertMenu_image = {
  name: 'Image',
  icon: 'editor:insert-photo',
  actions: ['insert-image'],
} as MenuDescription;

export const insertMenu_emoticon = {
  name: 'Emoticon',
  icon: 'editor:insert-emoticon',
  actions: ['insert-emoticon'],
} as MenuDescription;

export const insertMenu_horizontalLine = {
  name: 'Horizontal line',
  icon: 'remove',
  actions: ['insert-rule'],
} as MenuDescription;

export const insertMenu_footnote = {
  name: 'Footnote',
  shortcut: 'Ctrl+Alt+F',
  icon: 'description',
  actions: ['insert-footnote'],
} as MenuDescription;

export const insertMenu_specialCharacters = {
  name: 'Special characters',
  icon: 'editor:functions',
  actions: ['special-characters'],
} as MenuDescription;

export const insertMenu_link = {
  name: 'Link',
  shortcut: 'Ctrl+K',
  icon: 'editor:insert-link',
  actions: ['insert-link'],
} as MenuDescription;

export const insertMenu_comment = {
  name: 'Comment',
  shortcut: 'Ctrl+Alt+M',
  icon: 'editor:insert-comment',
  actions: ['insert-comment'],
} as MenuDescription;

export const insertMenu_authorsNote = {
  name: 'Author\'s note',
  icon: 'font-download',
  actions: ['authors-note'],
} as MenuDescription;

export const insertMenu = {
  name: 'Insert',
  items: [
    insertMenu_image,
    insertMenu_emoticon,
    insertMenu_horizontalLine,
    insertMenu_footnote,
    {separator: true},
    insertMenu_specialCharacters,
    insertMenu_link,
    insertMenu_comment,
    {separator: true},
    insertMenu_authorsNote,
  ],
} as MenuDescription;
